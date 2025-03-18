interface TimeTableGroupHeaderProps {
  title: string;
  duration: string;
  color: string;
}

export default function TimeTableGroupHeader({
  title,
  duration,
  color,
}: TimeTableGroupHeaderProps) {
  return (
    <>
      <div
        className="group-header"
        style={{
          borderLeftColor: color,
        }}
      >
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <h2 className="subtitle is-5 mb-0">{title}</h2>
          <span className="tag is-info is-light">{duration}</span>
        </div>
      </div>

      <style jsx>{`
        .group-header {
          background-color: transparent;
          border-radius: 4px;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          border-left: 4px solid;
        }
      `}</style>
    </>
  );
}
