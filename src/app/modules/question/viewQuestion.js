import React, {useState, useEffect} from 'react'
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router';
import Chip from '@material-ui/core/Chip';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import QuestionDataService from '../../core/actions/question';
import {
  CompanyTitleContainer,
  CompanyTitle,
  CompanyLogo,
  Row,
  Button,
  TagList, 
  IsVerified, 
  CheckBoxLabel, 
  TagLabel
  } from './components/QuestionElements';
import PreviewMedia from './previewMedia';

const ViewQuestion = () => {
  const history = useHistory();
    const match = useRouteMatch();
    const { id } = match.params;
    const [question, setQuestion] = useState(undefined);
    useEffect(() => {
      QuestionDataService.getQuestion(id)
        .then( (response) => {
          setQuestion(response.data);
          console.log(response.data);
      });
    }, []);

  const backtoQuestionList = () => {
    history.goBack();
  }

  return (
    <>
      {question !== undefined && 
      <>
      <Container>
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh', fontFamily:'Poppins Roboto sans-serf !important' }}>
        {question.questionType === 0 && <h8><strong><i><p>Question Type:&nbsp;&nbsp;&nbsp;Single Correct Answer</p></i></strong></h8>}
        {question.questionType === 1 && <h8><strong><i><p>Question Type:&nbsp;&nbsp;&nbsp;Multiple Correct Answer</p></i></strong></h8>}
        <div>Question : </div>
        <TextareaAutosize
            defaultValue={question.text}
            disabled
            style={{width : '100%', margin:'auto', fontSize:'16px', border:'none', bgcolor:'white',
                lineHeight:'16px', lineBreak:'10px', padding:'12px'
          }}
        />
      <PreviewMedia files = {question.files} />
        <TagLabel>Tags: </TagLabel>
        <TagList>
        {question.tags && question.tags.map((tag, j) => (
            <Chip variant='outlined' color='primary' label={tag} />
            ))}
        </TagList>
          <Row>
            <IsVerified
              type='checkbox'
            />
            <CheckBoxLabel htmlFor='isVerified'>is Verified</CheckBoxLabel>
          </Row>
          <hr/>
          {question &&
            question.options &&
            question.options.map((option, j) => (
              <div>Option {j+1}
                <TextareaAutosize
                    defaultValue={option.text}
                    disabled
                    style={{width : '100%', margin:'auto', fontSize:'16px', border:'none', bgcolor:'white',
                        lineHeight:'16px', lineBreak:'10px', padding:'12px' 
                  }}
                />
                <PreviewMedia files = {option.files} />
                <TagLabel>Tags: </TagLabel>
                <TagList>
                {option.tags && option.tags.map((tag, j) => (
                    <Chip variant='outlined' color='primary' label={tag.tag} />
                  ))}
                </TagList>
                <hr/>
                </div>
            ))}
          <Row>
          <Button onClick={backtoQuestionList}>
            Back
          </Button>
          </Row>
        </Box>
        </Container>
      </>
      }
    </>
  )
}

export default ViewQuestion;