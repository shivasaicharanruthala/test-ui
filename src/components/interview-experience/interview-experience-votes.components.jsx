import * as React from "react";
import { useContext } from "react";

// import styled components & Icons from Material UI.
import {UserContext} from "../../Context/user.context";


// import styled components & Icons from Material UI.
import { Typography } from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { CustomAlert } from '../Alerts/alert';
import { modifiyUpvotes } from "../../services/interview-experinces";

import './interview-experience-votes.styles.scss';

// function to handle interview experience upvotes and downvotes
const Votes = ({experienceId, upvotes}) => {
    const {userData} = useContext(UserContext)
    const userId = userData.id

    const [count, setCount] = React.useState(upvotes ?? 0);

    const [isAlertSet, setIsAlertSet] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");

    // function to handle upvotes change
    const handleUpvotesChange = (upvote) => {
        const apiCall = async () => {
            return await modifiyUpvotes(userId, experienceId, {"upvotes": upvote})
        }

        apiCall().then(res => {
            if(Object.keys(res).length > 0) {
                setCount(res.upvotes)
            }
        }).catch(err => {
            console.log("error: ", err)
            setIsAlertSet(true);
                setAlertMessage("Couldn't modify upvotes")
        })
    }

    return (
        <div className="upvotes" >
            <CustomAlert isAlertSet={isAlertSet} severity="error" message={alertMessage} />

            {/* upvotes */}
            <div className="up-vote" onClick={() => handleUpvotesChange(true)}>
                <ExpandLessIcon fontSize="large" className="upvote-btn"/>
            </div>

            {/* Storing votes count */}
            <div className="count">
                <Typography variant="h6" sx={{color: 'black'}}>{count}</Typography>
            </div>

            {/* downvotes */}
            <div className="down-vote" onClick={() =>  handleUpvotesChange(false)}>
                <ExpandMoreIcon className="downvote-btn" fontSize="large" />
            </div>
        </div>
    );
}

export default Votes;

