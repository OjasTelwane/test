import React, { useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useHistory } from 'react-router';

import TestQuestionDataService from '../../core/actions/testQuestion';
import TestDataService from '../../core/actions/test';

// current page, current index
import Button from '@material-ui/core/Button';
import {
  useRouteMatch
} from 'react-router-dom';

import {
  CompanyTitleContainer,
  CompanyTitle,
  CompanyLogo,
  QuestionOptionForm,
  QuestionContainer,
  Label,
  RowHeading,
  ListItem,
  FormContainer,
  FullScreenStyle
} from './components/TestElements';
import SingleQuestion from './singleQuestion';
import EvaluationQuestion from './evaluationQuestion';
import Instructions from './instructions';
import Timer from './timer';
import io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { convertDateTimeToServer} from '../date-utils';

const TestComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [question, setQuestion] = useState();
  // const [currentIndex, _setCurrentIndex] = useState(0);

  const [disableNext, setDisableNext] = useState(false);
  const [disablePre, setDisablePre] = useState(true);
  const [sort, setSort] = useState([{ field: 'status', order: -1 }]);
  const match = useRouteMatch();
  const { id, status } = match.params;
  const handle = useFullScreenHandle();
  const history = useHistory();
  const [time, setTime] = useState(new Date());

  const getSelectedOption = async (options) => {
    let optionId;
    if(options && options.length > 0) {
      // console.log('inside options');
      await options.every((o) => {
        if(o.selectedOption === true) {
          // console.log('found option==>', o._id);
          optionId = o.text;
          return true;
        } 
        return false;
      });
      // console.log('Outside options==>', optionId);
      return optionId;
    }
  }
  // const setCurrentIndex = (index) => {
  //   _setCurrentIndex(index);
  //   setQuestion(questions[index]);
  // }
  useEffect(() => {
    document.documentElement.style.userSelect = 'none';
}, []);
  useEffect(() => {
    document.oncontextmenu = document.body.oncontextmenu = function() {return false;}
    document.addEventListener('keyup', (e) => {
      if (e.key == 'PrintScreen') {
          navigator.clipboard.writeText('');
          e.preventDefault();
          console.log("Tried Taking Screenshot");
      }
  });
  
  /** TO DISABLE PRINTS WHIT CTRL+P **/
  document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key == 'p') {
          console.log("Tried Printing Page");
          e.cancelBubble = true;
          e.preventDefault();
          e.stopImmediatePropagation();
      }
  });
  }, []);
  useEffect( () => {
    console.log('id===>', id);
    if(id) {
      const testId = id;

      async function fetchData(testId) {
        const ql = await TestQuestionDataService.getAllTestQuestions(testId, sort, 0, 50);
        console.log('ql from testQuestionDataService===>', ql);
        const questions = ql.data.questions.map((q) => {
          if(q.questionType === 0) {
            q.selected_option_id = getSelectedOption(q.options) 
            return q;
          }
          return q;
        }); 
        console.log('questions.length', questions.length);
        setQuestions(questions);
        setCurrentIndex(0);
      }

      const socket = io.connect(environment.settings.apiURL, {reconnect: true});
      if(socket) {
        socket.emit('join', `test_${testId}`);
        // socket.on('connect_error', (err) => { console.log(`connect_error due to ${err.message}`);});
        console.log('sent join', `test_${testId}`);
        socket.on('onNewQuestion', (newQuestion) => {
          console.log('onNewQuestion received===>', newQuestion);
          setQuestions((prevState) => {
            const newQuestions = [...prevState];
            newQuestions.push(newQuestion);
            return newQuestions;
          });
        });
      }
      fetchData(id);
    }
  }, []);

  const findAndReplaceQuestion = (updatedQuestion) => {
    const updateQuestions = [];
    updateQuestions.push(updatedQuestion);
    const newQuestions = questions.map(q => updateQuestions.find(uq => uq.id === q.id) || q);
    setQuestions(newQuestions);
  }

  const updateQuestion = async (updatedTestQuestion) => {
    if(updatedTestQuestion.questionType === 0) {
      updatedTestQuestion.options.forEach((o) => {
        o.selectedOption = false;
        if(o.text === updatedTestQuestion.selected_option_id) {
          o.selectedOption = true;
        }
      });
    }
    console.log('updatedTestQuestion==>', updatedTestQuestion);
    const retQuestion = await TestQuestionDataService.updateTestQuestion(updatedTestQuestion.id, updatedTestQuestion);
    // console.log('retQuestion==>', retQuestion);
    findAndReplaceQuestion(retQuestion);
  }

  const handleEndTimer = async (e) => {
    finishStep(e);
  }

  const finishStep = async (e) => {
    if(questions !== undefined) {
      const updatedTestQuestion = questions[currentIndex];
      updateQuestion(updatedTestQuestion);
      handleEndTest(e);
    }
  }

  const progressTest = () => {
    const endTime = Date.now();
    var newEndTime = convertDateTimeToServer(endTime);
    TestDataService.progressTest(id, newEndTime); 
  }

  const nextStep = async () => {
    if(questions !== undefined) {
      setDisablePre(false);
      if(currentIndex < questions.length - 1) {
        const updatedTestQuestion = questions[currentIndex];
        updateQuestion(updatedTestQuestion);
        progressTest();
        if(currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex+1);
        }
      }
      if(currentIndex === questions.length-1){
        setDisableNext(true);
      }
    }
  }

  const preStep = async () => {
    if(questions !== undefined) {
      setDisableNext(false);
      if(currentIndex > 0) {
        setCurrentIndex(currentIndex-1);
      }
      if(currentIndex === 0){
        setDisablePre(true);
      }
    }
  }

  const handleResponse = async (e) => {
    const option = e.target?.name;
    const selectedOption = e.target?.value;
    console.log('option' ,option);
    console.log('selectedOption', selectedOption);
    await setQuestions((prevState) => {
      const newQuestions = prevState.map((item) => 
      (item.id === option ?
          { ...item, selected_option_id: selectedOption } : { ...item}
      ));
      return newQuestions;
    });
    console.log('response', questions);
  }

  const handleStartTest = async (e) => {
    handle.enter();
    const testdata = await TestDataService.getTest(id);
    const test = testdata.data;
    console.log('test==>', test);

    if(test.status !== 'Assigned' && test.status !== 'Start' && test.status !== 'Progress'){
      console.log('Invalid Test, could not process this test');
      handleEndTest(e);
    }
    else if(test) {
        if(test.status !== 'Assigned' ){
          for (let i = 0; i < questions.length; i++) {
            if(questions[i].status !== 'Assigned'){
              setCurrentIndex(i);
              break;
            }
          }
        }
      if(test.status !== 'Assigned'){
        var endTime = new Date(test.endTime);
        var startTime = new Date(test.startTime);
        const difference = Math.abs(endTime - startTime)/1000;
        console.log('difference==>', difference);
        test.testDuration = Math.abs((test.testDuration) - difference)/60;
        console.log('Test Duration==>', test.testDuration);
      }
      const duration = test.testDuration;
      console.log('duration==>',duration);
      const durationSeconds = duration * 60; 
      console.log('durationSeconds==>', durationSeconds);
      setTime(new Date());
      time.setSeconds( time.getSeconds() + durationSeconds);
    }
    if(test.status === 'Assigned'){
      const testDate = Date.now();
      const startTime = Date.now();
      var newTestDate = convertDateTimeToServer(testDate);
      var newStartTime = convertDateTimeToServer(startTime);
      TestDataService.startTest(id, newTestDate, newStartTime);
    }
  }

  const handleEndTest = (e) => {
    handle.exit();
    const endTime = Date.now();
    var newEndTime = convertDateTimeToServer(endTime);
    TestDataService.endTest(id, newEndTime); 
    history.goBack();
  }

  return (
    <>
        <FullScreenStyle>
        <CompanyTitleContainer>
          <CompanyLogo>
            <CompanyTitle>IMATMI</CompanyTitle>
          </CompanyLogo>
        </CompanyTitleContainer>
        <br/><br/>
      <Instructions handleChange={handleStartTest}/> 
      <FullScreen handle={handle}>
        
        {handle.active && (
          <div style={{'background':'white'}}>
          <FormContainer>
          <div style={{'float' : 'left'}}>
              <h2>Test Title</h2>  
          </div>
          <div style ={{'display' : 'flex', 'flexDirection' : 'row', 'justifyContent' :'flex-end', 'columnGap':'15px'}}>
              <Timer expiryTimestamp = {time} onExpire = {handleEndTimer} />
          </div>
          </FormContainer>
        <QuestionOptionForm>
          <QuestionContainer>
            { questions !== undefined && questions.length > 0 && (
              <ListItem>
                  <div style={{'height' : '500px'}}>
                    {/* <RowHeading>
                      <Label>Question {currentIndex+1} of {questions.length}</Label>
                    </RowHeading> */}
                    { questions[currentIndex].questionType === 3 && (
                      <EvaluationQuestion question = {questions[currentIndex]} tickOptions={true} handleChange={handleResponse}/> 
                    )}
                    { questions[currentIndex].questionType !== 3 && (
                      <SingleQuestion question = {questions[currentIndex]} tickOptions={true} handleChange={handleResponse}/>
                    )}
                    </div>
              </ListItem>
            )}
            </QuestionContainer>
        </QuestionOptionForm>
        <div style ={{'display' : 'flex', 'flexDirection' : 'row', 'justifyContent' :'flex-end', 'marginRight' : '60px', 'columnGap':'10px', 'position':'sticky'}} >
          <Button
            color='primary'
            variant='contained'
            onClick={preStep}
            disabled = {disablePre || (currentIndex === 0)}
          >
            Previous
          </Button>
          <Button
          color='primary'
            variant='contained'
            onClick={nextStep}
            disabled = {disableNext || (currentIndex === questions.length-1)}
          >
            Next
          </Button>
          <Button
            color='secondary'
            variant='contained'
            onClick={finishStep}
            disabled = {currentIndex !== questions.length-1}
          >
            Finish
          </Button>
        </div>
        <br></br>
        <br></br>
        </div>
        )}
        
        
      </FullScreen>
      </FullScreenStyle>
    </>
  );
}

export default TestComponent;
