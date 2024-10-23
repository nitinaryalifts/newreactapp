import { Outlet, Link } from "react-router-dom";

const Error404 = () => {
    return (
        <>
         <h1>This route is not exist</h1>;
         <p>Back to About Me</p>
         <Link to="/">About me</Link>
        </>
    )
  };
  
export default Error404;