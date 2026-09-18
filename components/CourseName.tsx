type CourseNameProps = {
  name: string;
};

const courseSuffix = "フレンチコース";

export function CourseName({ name }: CourseNameProps) {
  if (!name.endsWith(courseSuffix)) return <span className="course-name">{name}</span>;

  const prefix = name.slice(0, -courseSuffix.length);

  return (
    <span className="course-name">
      <span className="course-name-prefix">{prefix}</span>
      <wbr />
      <span className="course-name-suffix">{courseSuffix}</span>
    </span>
  );
}
