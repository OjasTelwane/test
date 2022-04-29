import { style } from '@mui/system';
import styled from 'styled-components';

export const MainContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 1.2rem;
`;
export const InfoContainer = styled.div`
    width: 25%;
    background-color: rgb(255, 255, 255);
    /* margin: auto; */
    padding: 0 2rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    /* margin-left: 5rem; */
    overflow: auto;
    border-radius: 1.5rem;
`;
export const InfoImage = styled.div`
    width: 50%;
    height: auto;
    border-radius: 50%;
    margin-top: 1rem;
`;
export const InfoName = styled.div`
    margin-top: 1rem;
    font-size: 20px;
    font-weight: bold;
`;
export const TestName = styled.div`
    margin-top: 1rem;
`;
export const InfoOptions = styled.div`
    width: 80%;
    flex-direction: row;
    margin-bottom: 10px;
    font-size: 1rem;
`;
export const SmallBox = styled.div`
    margin: 0.3rem;
    background-color: rgb(207, 209, 201);
    width: 20%;
    height: 2rem;
    border-radius: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    float: left;
`;
export const AnswerBox = styled.div`
    margin: 0.3rem;
    background-color: rgb(54, 247, 138);
    width: 20%;
    height: 2rem;
    border-radius: 0.3rem;
    border: 2px solid green;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    float: left;
`;
export const Bre = styled.div`
    font-size: 16px;
    clear:both;
`;
export const TotalTime = styled.div`
    font-size: 16px;
    margin: 10px;
`;
export const InfoAttempted = styled.div`
    margin: 0.5rem;
    margin-top: 1.4rem;
    font-size: 15px;
`;

export const Info1 = styled.div`
    margin-top: 10px;
    color: rgb(139, 142, 129);
    text-align: left;
    display : inline-block;
`
export const RemainingTime = styled.div`
    font-size: 20px;
    font-weight: bolder;
    margin-top: 3rem;
`;
export const RemainingTime1 = styled.div`
    color: red;
    font-size: 25px;
    font-weight: bold;
    margin-top: 1rem;
`;
export const InfoButtons = styled.div`
    width: 90%;
    margin: auto;
    margin-left: 2rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
`;

export const LeaveButton = styled.div`
    padding: 8px;
    border-radius: 1rem;
    margin-right: 10px;
    padding-right: 10px;
    background-color: rgb(64, 61, 61);
    color: white;
    padding-left: 10px;
    padding-right: 10px;
`
export const SubmitButton = styled.div`
    padding: 8px;
    border-radius: 1rem;
    padding-right: 10px;
    background-color: rgb(108, 108, 255);
    padding-left: 10px;
    padding-right: 10px;
`
export const NextButton = styled.div`
    padding: 8px;
    border-radius: 1rem;
    padding-right: 10px;
    background-color: rgb(217,217,217);
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 6rem;
    margin-right: 6rem;
`
export const ScreenContainer = styled.div`
    width: 75%;
    /* background-color: blanchedalmond; */
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
`;
export const ScreenQuestion = styled.div`
    width: 83%;
    margin-bottom: 1rem;
    margin-right: 2rem;
    margin-left: 3rem;
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
`;
export const QuestionNumber = styled.div`
    background-color: rgb(255, 254, 252);
    width: 7%;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
    font-size: 30px;
    border: dimgray;
    border-style: solid;
`;
export const QuestionBody = styled.div`
    display: flex;
    /* flex-flow: row wrap; */
    width: 93%;
    flex-direction: column;
    font-family: Roboto;
    font-size: 1.4rem;
    line-height: 2.2rem;
    margin-left: 5px;
`;
export const QuestionOptions = styled.div`
    width: 75%;
    margin-left: 8rem;
  
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
export const ScreenButtons = styled.div`
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;
export const TestScreenOptions = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    flex-wrap: wrap;
`;
export const RoundCheckbox = styled.div`
    position: relative;
    margin-right: 8rem;
    flex-basis: 60%;
    font-family: Roboto;
    font-size: 1.4rem;
    line-height: 1.6rem;
    cursor: pointer;
`;
export const Round = styled.div`
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    height: 33px;
    left: 0;
    position: absolute;
    top: 0;
    width: 33px;
`
export const OptionText = styled.div`
    line-height: 25px;
`