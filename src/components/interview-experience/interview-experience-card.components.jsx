import moment from 'moment';
import * as React from 'react';

import { useContext } from 'react';
// import styled components from Material UI.
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Votes from './interview-experience-votes.components';
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import {Card,CardContent, CardActions, Collapse, IconButton, Typography, Chip, Avatar, Divider } from '@mui/material';

// import user context to access or set user data.
import { UserContext } from "../../Context/user.context";

// imports dependent components.
import { CustomAlert } from '../Alerts/alert';
import { deleteInterviewExperience } from '../../services/interview-experinces';
import InterviewExperienceModal from './interview-experience-model.components';
import InterviewExperienceComments from './interview-experience-comments.components';
import microsoftLogo from './microsoft.png';
import googleLogo from './google.png';
import amazonLogo from './amazon.jpeg'

// imports styles for this component.
import './interview-experience-card.styles.scss';



const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// users to post their interview experiences card component
export default function InterviewExperienceCard({ experience, experiencesLength, setExperiencesLength, handleExpericesEdit }) {
  console.log("tags: ", experience.tags)
  const { userData } = useContext(UserContext)
  const userId = userData.id

  const [expanded, setExpanded] = React.useState(false);
  const [interviewComment, setInterviewComment] = React.useState(experience.comments)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const [isAlertSet, setIsAlertSet] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  }

  // function to handle interview experience delete
  const handleInterviewExperienceDelete = (experinceId) => {
    const apiCall = async () => {
      return await deleteInterviewExperience(userId, experinceId)
    }

    apiCall().then(res => {
      setExperiencesLength(experiencesLength - 1)
    }).catch(err => {
      console.log("error: ", err)
      setIsAlertSet(true);
      setAlertMessage("No Interview experience to Delete")
    })
  }

  return (
    <>
      <Card sx={{ width: "1135px", marginTop: '10px', marginBottom: '30px', boxShadow: 4, borderRadius: 3 }}>
        <Divider />
        <CardContent>
          <div className="card-title">
            <CustomAlert isAlertSet={isAlertSet} severity="error" message={alertMessage} />
            <div className="card-header">
              <div>
                <Typography gutterBottom variant="h5" component="div" align="left" style={{ marginLeft: '2px', width: '400px', marginBottom: 1, maxWidth: '800px' }}>
                  {experience.title}
                </Typography>
              </div>
            </div>
            <div className="cardIcons">
              {
                experience.userId === userId ? (
                  <div className="edit-delete-icons">
                    <ModeEditOutlineIcon className="edit-btn" fontSize="medium" color="primary" sx={{ cursor: 'pointer' }} onClick={handleModalOpen} />
                    <DeleteIcon className="delete-btn" fontSize="medium" sx={{ color: red[500], marginLeft: '10px', cursor: 'pointer' }} onClick={() => handleInterviewExperienceDelete(experience.id)} />
                  </div>
                ) : null
              }
              {/* Interview experience modal component to add a new experience */}
              <InterviewExperienceModal isModalOpen={isModalOpen} handleModal={handleModalOpen} experince={experience} handleExpericesEdit={handleExpericesEdit} />
            </div>
          </div>
          <Typography gutterBottom variant="caption" component="div" align="left" style={{ marginLeft: '2px', marginTop: 0, marginBottom: 10,backgroundColor:"#f8f9fa" }}>
            <b>User: </b>{experience.name} &emsp; <b>Interviewed On: </b>{moment(experience.interviewedDate, 'YYYY-MM-DDTHH:mm').format('Do MMMM YYYY')}
          </Typography>
          <Divider />

          <div class="cardRow">
            <div class="votes">
              {/* Interview experience votes component to upvote or downvote on experiences shared */}
              <Votes experienceId={experience.id} upvotes={experience.upvotes} />
            </div>
            <div class="experience">
              <dl>
                <dt align='left' marginLeft='2px'><b>Application Process</b></dt>
                <dd align='left' marginLeft='2px' >{experience.applicationProcess}</dd>
                <dt align='left' marginLeft='2px'><b>Interview Process</b></dt>
                <dd align='left' marginLeft='2px'>{experience.interviewProcess}</dd>
                <dt align='left' marginLeft='2px'><b>Interview Experience</b></dt>
                <dd align='left' marginLeft='2px'>{experience.interviewExperience}</dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardActions disableSpacing sx={{backgroundColor:"#f8f9fa"}}>
          {/* Interview experience company chip */}
          <div className="chip">
            <Chip
              avatar={<Avatar alt="Natacha" src={experience.company === 'Microsoft' ? microsoftLogo : (experience.company === 'Google' ? googleLogo : amazonLogo)}/>}
              label={experience.company}
              color='warning'
              size="medium" sx={{backgroundColor:'rgb(21, 159, 187)'}}/>
          </div>
          {/* Interview experience tags */}
          <div className='tags-container'>
            {
              experience.tags.split(',').map(tag => <Chip label={tag} color='warning' size="medium" sx={{ margin: 1 , backgroundColor: 'rgb(209, 109, 21)'}} />)
            }
          </div>
          {/* Exapand more icon for comments section */}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {/* Interview experience comments component is added here */}
          <InterviewExperienceComments experinceId={experience.id} comments={experience.comments} setInterviewComment={setInterviewComment} />
        </Collapse>
      </Card>

    </>

  );
}