import { Link } from "react-router";

export function NotFound() {
  return (
    <header className="page-head notfound">
      <div>
        <h1>Nothing on this shelf</h1>
        <p className="sub">
          The page may have moved. <Link to="/">Back to the overview</Link>
        </p>
      </div>
    </header>
  );
}
