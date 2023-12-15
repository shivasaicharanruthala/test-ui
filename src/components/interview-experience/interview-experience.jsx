import { useState, useContext, useEffect } from "react";
import {UserContext} from "../../Context/user.context";

// imports dependent components.
import InterviewExperienceCard from "./interview-experience-card.components";
import { getAllInterviewExperience } from "../../services/interview-experinces.js";
import InterviewExperienceModal from './interview-experience-model.components';

// imports styled Material components.
import Button from '@mui/material/Button';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import './interview-experience.scss';

// main interview experience function
const InterviewExperience = () => {
    const {userData} = useContext(UserContext);
    const userId = userData.id

    const [experiences, setExperiences] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [experiencesLength, setExperiencesLength] = useState(0)    
    const [expericeEdited, setExpericesEdited] = useState(false)

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const handleExpericesEdit = () => setExpericesEdited(!expericeEdited)

    useEffect(() => {
        const fetchData = async () => {
            return await getAllInterviewExperience(userId)
        }

        fetchData().then(res => {
            setExperiences(res)
        }).catch(err => {
            console.log("error: ", err)
        })
    }, [experiencesLength, expericeEdited])

    return (
        <div>
            {/* Add new interview experience modal */}
            <InterviewExperienceModal isModalOpen={isModalOpen} handleModal={handleModal} experiencesLength={experiencesLength} setExperiencesLength={setExperiencesLength} />
            <div className="add-experience-btn">
                <Button
                    color="primary"
                    variant="contained"
                    endIcon={<AddOutlinedIcon fontSize="small" />}
                    onClick={handleModal}
                >Add Experience</Button>
            </div>
            <div>
                {
                    experiences.map(experience => <InterviewExperienceCard key={experience.id} experience={experience} experiencesLength={experiencesLength} setExperiencesLength={setExperiencesLength} handleExpericesEdit={handleExpericesEdit}/>)
                }
            </div>
        </div>
    )
}

export default InterviewExperience;