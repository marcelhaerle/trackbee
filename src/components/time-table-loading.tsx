export default function TimeTableLoading() {
  return (
    <div className="container mt-5">
      <div className="loading-skeleton">
        <div className="loading-header"></div>
        <div className="loading-row"></div>
        <div className="loading-row"></div>
        <div className="loading-row"></div>
      </div>
      <style jsx>{`
        .loading-skeleton {
          width: 100%;
        }
        .loading-header {
          height: 40px;
          background: transparent;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        .loading-row {
          height: 60px;
          background: transparent;
          margin-bottom: 10px;
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
