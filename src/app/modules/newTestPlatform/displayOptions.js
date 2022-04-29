import React from 'react';
import './options.css'
import {
    TestScreenOptions,
    OptionText
}
from './testElement';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles } from '@material-ui/core/styles';

const TestOptions = ({ questionObj, selectedOption, setSelectedOption, handleResponse }) => {
    let inputClass = {};
    let control = {};
    console.log(inputClass);
    const questionType = questionObj.questionType;
    if (questionType === 0) {
        inputClass = { divClass: 'radiomark', type: 'radio' };
        control = {type: 'Radio'};
    } else if (questionType === 1) {
        inputClass = { divClass: 'radiomark', type: 'checkbox' };
        control = {type: 'Checkbox'};
    }else if (questionType === 2) {
        inputClass = { type: 'hidden', divClass: 'col-md-offset-1 col-md-11' };
    }
    const styles = createStyles({
        formControlLabel: { fontSize: '6rem', color: 'red',
        '& label': { color: 'red' } }
     });
    const onChangeValue = (e,option,id) => {
            if (questionType === 0) {
                setSelectedOption({['id']: id, ['option']: option});
                handleResponse(e);
            } else {
                if (e.target.checked) {
                    setSelectedOption(selectedOption=> ([...selectedOption,{['id']: id, ['option']: option}]));
                } else {
                    let newArr = selectedOption.filter((opt) => opt.id !== id);
                    setSelectedOption(newArr);
                    handleResponse(e);
                }
              }
    }
    return (
    <TestScreenOptions>
    <RadioGroup
        aria-label={questionObj.id}
        name={questionObj.id}
        value={questionObj.selected_option_id}
        onChange={handleResponse}
    >
    {
        questionObj.options.map((option, index) => { 
            return (
            <div class='container'>
                <FormControlLabel value={option.text} control={<Radio />} 
                label={<Typography style={{ }}>{option.text}</Typography>}/>
            </div>
            )}
        )
    }
    </RadioGroup>
    </TestScreenOptions>

    );
};

export default TestOptions;
