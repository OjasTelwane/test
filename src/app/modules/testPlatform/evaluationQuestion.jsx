import React, {useEffect} from 'react'
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import {
    QuestionArea,
    TestQuestionTextArea,
    OptionArea
} from './components/TestElements';
import PreviewMedia from '../question/previewMedia';

function shuffle(o){ 
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
};

const EvaluationQuestion = ({question, tickOptions, handleChange }) => {
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
                <PreviewMedia files = {question.files?question.files:question.file} />
            </QuestionArea>
            <OptionArea>
                {question.questionType === 3 && 
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
                            <PreviewMedia files = {option.files?option.files:option.file} />
                        </div>
                        )}
                    )}
                    </RadioGroup>
                }   
                {question.questionType === 1 && 
                    <div>
                        { question.options.map((option, index) => { 
                            return (
                            <div>
                                <FormControlLabel
                                    control={
                                    <Checkbox checked={false} onChange={handleChange} name='option_multi' />
                                    }
                                    label={option.text}
                                />
                                <PreviewMedia files = {option.files?option.files:option.file} />
                            </div>
                            )}
                        )}
                    </div>
                }   
            </OptionArea>
        </div>
    )
}

export default EvaluationQuestion;
