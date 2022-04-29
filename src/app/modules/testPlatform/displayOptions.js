import React from 'react';
import './options.css'
import {
    TestScreenOptions,
    OptionText
}
from './testElement';

const TestOptions = ({ questionObj, selectedOption, setSelectedOption, handleResponse}) => {
    let inputClass = {};
    const questionType = questionObj.questionType;
    if (questionType === 0) {
        inputClass = { divClass: 'radiomark', type: 'radio' };
    } else if (questionType === 1) {
        inputClass = { divClass: 'radiomark', type: 'checkbox' };
    }else if (questionType === 2) {
        inputClass = { type: 'hidden', divClass: 'col-md-offset-1 col-md-11' };
    }

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
    {
        questionObj.options.map((option,key) => {
            return (
                <>
                    <label className='container'>
                        <OptionText>{option}</OptionText>
                        <input type={inputClass.type}
                            name={questionObj.questionId}
                            value={option}
                            id={key}
                            onChange={(event) => {
                                onChangeValue(event, option, key);
                            }}
                        />
                        <span className={inputClass.divClass}></span>
                    </label>
                </>
            )
        })
    }
    </TestScreenOptions>

    );
};

export default TestOptions;
