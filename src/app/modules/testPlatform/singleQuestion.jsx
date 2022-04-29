import React, { useEffect, useState } from 'react'
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { RadioButton } from 'primereact/radiobutton';
import {
    QuestionArea,
    TestQuestionTextArea,
    OptionArea
  } from '../testPlatform/components/TestElements';

function shuffle(o){ 
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
};

const SingleQuestion = ({question, tickOptions, handleChange }) => {
    // const [selected_option, setSelectedOption] = useState('');
    // response.map((res) => {
    //     if(res.question_id == question.id) {
    //         setSelectedOption(res.selected_option_id);
    //     }
    // })
    // console.log('Single-question==>', question);

    const [optionSelected, setOptionSelected] = useState(question.options[0]);

    useEffect(() => {
        let options = question.options;
        console.log('before==>', options);
        options = shuffle(options);
        console.log('after==>', options);
        question.options = [...options];
    }, [question]);

    const getSelectedOption = async (options) => {
        let optionId;
        if(options && options.length > 0) {
            // console.log('inside options');

            options.every((o) => {
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
    return (
        <div>
            <QuestionArea>
                <TestQuestionTextArea disabled defaultValue={question.text}>
                    {question.text}
                </TestQuestionTextArea>
            </QuestionArea>
            <OptionArea>
                {question.questionType === 0 && 
                    <RadioGroup
                        aria-label={question.id}
                        name={question.id}
                        value={question.selected_option_id}
                        onChange={handleChange}
                    >
                    { question.options.map((option, index) => { 
                        return (
                        <div>
                            <FormControlLabel value={option.text} control={<Radio />} label={option.text}/>
                        </div>
                        )}
                    )}
                    </RadioGroup>
                }   
            </OptionArea>
        </div>
    )
    // return (
    //     <div>
    //         <QuestionArea>
    //             <TestQuestionTextArea disabled defaultValue={question.text}>
    //                 {question.text}
    //             </TestQuestionTextArea>
    //         </QuestionArea>
    //         <OptionArea>
    //         {question.questionType === 0 && 
    //             (
    //                 question.options.map((option, index) => {
    //                     return (
    //                         <div key={option.selectedOption} className='p-field-radiobutton'>
    //                             <RadioButton
    //                                 inputId={option.selectedOption} 
    //                                 name='option' 
    //                                 value={option.selectedOption} 
    //                                 // onChange={(e) => setOptionSelected(e.value)}  
    //                                 onChange={(e) => handleChange}
    //                                 // checked={optionSelected === option.selectedOption} 
    //                                 />
    //                             <label htmlFor={option.selectedOption}>{option.text}</label>
    //                         </div>
    //                     )
    //                 })
    //             )
    //         }
    //             {/* {question.questionType === 0 && 
    //                 <RadioGroup
    //                     aria-label={question.id}
    //                     name={question.id}
    //                     value={question.selected_option_id}
    //                     onChange={handleChange}
    //                 >
    //                 { question.options.map((option, index) => { 
    //                     return (
    //                     <div>
    //                         <FormControlLabel value={option.text} control={<Radio />} label={option.text}/>
    //                     </div>
    //                     )}
    //                 )}
    //                 </RadioGroup>
    //             }    */}
    //         </OptionArea>
    //     </div>
    // )
}

export default SingleQuestion;
