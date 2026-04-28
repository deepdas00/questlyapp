export default function Stats({ total, present }) {
  const percentage = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Total Days: {total}</h2>
      <h2>Present: {present}</h2>
      <h2>Attendance %: {percentage}</h2>
    </div>
  );
}