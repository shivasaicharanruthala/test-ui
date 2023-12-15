import {useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import {UserContext} from "./Context/user.context";

// Protected Components is to redirect not authorized to login page.
const Protected = ({children}) => {
    const { userData } = useContext(UserContext)
    const navigate = useNavigate();

    const isLoggedIn = userData.isLoggedIn

    useEffect(() => {
        if(!isLoggedIn) {
            return navigate("/login");
        }
    }, [])

    return children
}

export default Protected;
