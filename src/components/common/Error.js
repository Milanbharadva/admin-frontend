import { Link, useNavigate } from "react-router-dom";
const Error = (props) => {
  const navigate = useNavigate();
  return (
    <main>
      <div className="container">
        <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <h1>404</h1>
          <h2>The page you are looking for doesn't exist.</h2>
          <Link className="btn" onClick={navigate(-1)}>
            Back to home
          </Link>
          <img
            src={`${process.env.PUBLIC_URL}/assets/img/not-found.svg`}
            className="img-fluid py-5"
            alt="Page Not Found"
          />
        </section>
      </div>
    </main>
  );
};
export default Error;