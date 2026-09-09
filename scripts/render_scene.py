import bpy
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts" / "blender-test.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE_NEXT"
scene.render.resolution_x = 960
scene.render.resolution_y = 540
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = str(OUT)
scene.render.film_transparent = False
scene.world.color = (0.004, 0.005, 0.004)

def mat(name, color, metallic=0.0, roughness=0.5):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    return material

charcoal = mat("Smoked charcoal", (0.012, 0.016, 0.014), 0.05, 0.38)
porcelain = mat("Porcelain", (0.72, 0.70, 0.64), 0.0, 0.2)
chrome = mat("Smoked chrome", (0.34, 0.37, 0.36), 0.93, 0.12)
ember = mat("Ember sauce", (0.42, 0.018, 0.008), 0.05, 0.16)

bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -0.14))
bpy.context.object.data.materials.append(charcoal)

# Porcelain plate with physically plausible thickness.
bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=3.15, depth=0.16, location=(0, 0, 0))
plate = bpy.context.object
plate.scale.z = 0.42
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
bevel = plate.modifiers.new("Soft porcelain rim", "BEVEL")
bevel.width = 0.24
bevel.segments = 8
plate.data.materials.append(porcelain)

bpy.ops.mesh.primitive_torus_add(major_radius=2.56, minor_radius=0.11, major_segments=128, minor_segments=20, location=(0, 0, 0.11))
sauce = bpy.context.object
sauce.scale.y = 0.7
sauce.data.materials.append(ember)

# Minimal chrome knife, kept to the right of the plate.
bpy.ops.mesh.primitive_cube_add(location=(3.75, 0.15, 0.02), scale=(0.16, 2.7, 0.035))
knife = bpy.context.object
knife.rotation_euler.z = math.radians(-8)
knife.data.materials.append(chrome)
knife_bevel = knife.modifiers.new("Knife edge", "BEVEL")
knife_bevel.width = 0.12
knife_bevel.segments = 5

# Ingredient fragments.
for i, (x, y, z, s) in enumerate([(-0.7,0.2,0.35,.42),(0.15,-0.35,.31,.5),(.8,.35,.4,.34),(-.1,.72,.42,.26)]):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=s, location=(x,y,z))
    obj = bpy.context.object
    obj.scale.z = 0.32
    obj.data.materials.append(charcoal if i % 2 else ember)

def area(name, location, energy, color, size):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.shape = "DISK"
    data.size = size
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (math.radians(18), 0, math.radians(28))

area("Porcelain key", (-4, -3, 6), 1100, (0.74, 0.82, 0.80), 4.5)
area("Ember rim", (4, 1, 2), 800, (1.0, 0.08, 0.015), 2.0)

bpy.ops.object.camera_add(location=(7.8, -9.8, 7.3))
camera = bpy.context.object
scene.camera = camera
camera.data.lens = 58
camera.data.dof.use_dof = True
camera.data.dof.focus_object = plate
camera.data.dof.aperture_fstop = 2.8

def look_at(obj, target=(0, 0, 0)):
    direction = mathutils.Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

import mathutils
look_at(camera, (0.2, 0, 0.25))
scene.view_settings.look = "AgX - Medium High Contrast"
bpy.ops.render.render(write_still=True)
