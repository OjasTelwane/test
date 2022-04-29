import React, { useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useHistory } from 'react-router';
import TestOptions from './displayOptions';
import userIcon from '../../../assets/images/user-icon.png'
import TestQuestionDataService from '../../core/actions/testQuestion';
import TestDataService from '../../core/actions/test';
import { useRouteMatch } from 'react-router-dom';
import './options.css';
import {
  MainContainer,
  InfoContainer,
  InfoImage,
  InfoName,
  TestName,
  InfoOptions,
  AnswerBox,
  SmallBox,
  Bre,
  TotalTime,
  InfoAttempted,
  RemainingTime,
  RemainingTime1,
  InfoButtons,
  LeaveButton,
  SubmitButton,
  NextButton,
  Info1,
  ScreenContainer,
  ScreenQuestion,
  QuestionNumber,
  QuestionBody,
  QuestionOptions,
  ScreenButtons
}
from './testElement';
import Instructions from './instructions';
import Timer from './timer';
import io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { convertDateTimeToServer} from '../date-utils';


const TestComponent = () => {
  const userData = {
    userName: 'Hamlett Garcia',
    userId: '1',
    testName: 'Personality Test'
  }
  const [userAnserData,changeuserAnswerData] = useState({
    questionAnsered: 0,
    questionUnAnsered: 0,
    questionReviewed: 0
  });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [disableNext, setDisableNext] = useState(false);
  const [enableFinish, setEnableFinish] = useState(false);
  const [disablePre, setDisablePre] = useState(true);
  const [sort, setSort] = useState([{ field: 'status', order: -1 }]);
  const match = useRouteMatch();
  const { id, status } = match.params;
  const handle = useFullScreenHandle();
  const history = useHistory();
  const [time, setTime] = useState(new Date());
  const [testData, setTestData] = useState();
  const [selectedOption, setSelectedOption] = useState([]);
  console.log(selectedOption);
  useEffect(() => {
      document.documentElement.style.userSelect = 'none';
  }, []);
  useEffect(() => {
    document.oncontextmenu = document.body.oncontextmenu = function() {return false;}
    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
          navigator.clipboard.writeText('');
          e.preventDefault();
          console.log("Tried Taking Screenshot");
      }
  });
  
  /** TO DISABLE PRINTS WHIT CTRL+P **/
  document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'p') {
          console.log("Tried Printing Page");
          e.cancelBubble = true;
          e.preventDefault();
          e.stopImmediatePropagation();
      }
  });
  }, []);
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
  useEffect( () => {
    console.log('id===>', id);
    if(id) {
      const testId = id;
      async function fetchData(testId) {
        const testData = await TestDataService.getTest(id);
        setTestData(testData.data);
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

  const updateQuestion = async (updatedTestQuestion, finish = false) => {
    if(updatedTestQuestion.questionType === 0) {
      updatedTestQuestion.options.forEach((o) => {
        o.selectedOption = false;
        if(o.text === updatedTestQuestion.selected_option_id) {
          o.selectedOption = true;
        }
      });
    }
    if(finish) {
      const additions = { finish: true };
      const updated = { ...updatedTestQuestion, ...additions };
      updatedTestQuestion = updated;
      // updatedTestQuestion.finish = true;      
    }
    else {
      const additions = { finish: false };
      const updated = { ...updatedTestQuestion, ...additions };
      updatedTestQuestion = updated;
    }
    // console.log('@@@@@@@@@@@@@@@@@@@@@@updatedTestQuestion==>', updatedTestQuestion);
    const retQuestion = await TestQuestionDataService.updateTestQuestion(updatedTestQuestion.id, updatedTestQuestion);
    // console.log('retQuestion==>', retQuestion);
    findAndReplaceQuestion(retQuestion); 
  }

  const handleEndTimer = async (e) => {
    finishStep(e);
  }

  const finishStep = async (e) => {
    if(questions !== undefined) {
      console.log('Test Finish');
      const updatedTestQuestion = questions[currentIndex];
      updateQuestion(updatedTestQuestion, true);
      handleEndTest(e);
    }
  }

  const progressTest = () => {
    const endTime = Date.now();
    var newEndTime = convertDateTimeToServer(endTime);
    TestDataService.progressTest(id, newEndTime); 
  }

  const nextStep = async () => {
    setSelectedOption([]);
    if(questions !== undefined) {
      if(currentIndex < questions.length - 1) {
        const updatedTestQuestion = questions[currentIndex];
        updateQuestion(updatedTestQuestion);
        progressTest();
        if(currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex+1);
        }
      }
      if(currentIndex === questions.length-2){
        setDisableNext(true);
        // setEnableFinish(true);
      }
    }
  }

  // const preStep = async () => {
  //   if(questions !== undefined) {
  //     setDisableNext(false);
  //     if(currentIndex > 0) {
  //       setCurrentIndex(currentIndex-1);
  //     }
  //     if(currentIndex === 0){
  //       setDisablePre(true);
  //     }
  //   }
  // }

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
    const endTime = Date.now();
    var newEndTime = convertDateTimeToServer(endTime);
    TestDataService.endTest(id, newEndTime); 
    const path = '/test_result/' + id;
    handle.exit();
    history.push(path);
  }

  return (
    <>
    <Instructions handleChange={handleStartTest}/> 
    <FullScreen handle={handle}>
        
        {handle.active && (
          <div style={{'background':'#ededed', 'height': '100vh', 'overflowY': 'scroll'}}>
          <MainContainer>
          <InfoContainer>
          <center>
            <InfoImage>
              <img src={userIcon} height='100%' width='100%' style={{borderRadius: '50%'}}></img>
            </InfoImage>
            <InfoName>{testData.examineeName}
            </InfoName>
            <TestName>{testData.testName}</TestName>
            <InfoOptions>
            {
                questions.map((ques,index) => {
                  return(
                    index>=currentIndex ? <SmallBox>{index+1}</SmallBox> : <AnswerBox>{index+1}</AnswerBox>
                  )
              })
            }
            </InfoOptions>
            <Bre></Bre>
            <b><TotalTime>Total Time: {testData.testDuration} mins</TotalTime></b>
            <InfoAttempted>
              <Info1>Attempted : </Info1><b>{currentIndex}</b><br/>
              <Info1>Not Attempted : </Info1><b>{questions.length-currentIndex}</b><br/>
              <Info1>Marked for review : </Info1><b>{userAnserData.questionReviewed}</b><br/>
            </InfoAttempted>
            <RemainingTime>Time Remaining</RemainingTime>
            <RemainingTime1><Timer expiryTimestamp = {time} onExpire = {handleEndTimer} /></RemainingTime1>
            <InfoButtons>
              <LeaveButton><button onClick={finishStep}>Leave Test</button>
              </LeaveButton>
              <SubmitButton><button onClick={handleEndTest} disabled={currentIndex !== questions.length-1}>Submit</button>
              </SubmitButton>
            </InfoButtons>
            </center>
          </InfoContainer>
          <ScreenContainer>
          { questions !== undefined && questions.length > 0 && (
          <>
            <ScreenQuestion>
              <QuestionNumber>{currentIndex+1}</QuestionNumber>
              { questions !== undefined && questions.length > 0 && (
                <QuestionBody>{questions[currentIndex].text}</QuestionBody>
              )}
            </ScreenQuestion>
            <QuestionOptions>
                <TestOptions 
                  questionObj={questions[currentIndex]} 
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption} 
                  handleResponse={handleResponse}
                />
            </QuestionOptions>
            <ScreenButtons>
              {/* <NextButton><button onClick={preStep} disabled = {disablePre || (currentIndex === 0)}>Previous</button></NextButton> */}
              {/* <LeaveButton>Review</LeaveButton> */}
              { disableNext ? (
                <NextButton><button onClick={finishStep}>Finish Test</button></NextButton>
                ) : (
                  <NextButton><button onClick={nextStep}>Next</button></NextButton>
                ) }
              {/* <NextButton><button onClick={nextStep} disabled = {disableNext || (currentIndex === questions.length-1)}>Next</button></NextButton>
              <NextButton><button onClick={nextStep} disabled = {!(currentIndex === questions.length-1)}>Finish Test</button></NextButton> */}
            </ScreenButtons>
          </>
          )}
          
          { questions === undefined || questions.length <= 0 && (
                <QuestionBody>Question/ Test Not Loaded</QuestionBody>
            )}
          </ScreenContainer>
        </MainContainer>
        </div>
        )}
        
        
        </FullScreen>
    </>
  );
}

export default TestComponent;
