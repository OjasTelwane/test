import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Chart } from 'primereact/chart';
import {
    InfoImage,
    InfoName
} from '../testPlatform/testElement'
import userIcon from '../../../assets/images/user-icon.png'
import { useRouteMatch } from 'react-router-dom';
import TestDataService from '../../core/actions/test';

const TestResult = () => {
    const match = useRouteMatch();
    console.log('results match Received====>', match.params);
    const { id } = match.params;
    console.log('results ID Received====>', id);    
    // const [testData, setTestData] = useState();

    let chartData = {
        labels: ['Takes Initialtive', 'Communication Skills', 'Leadership', 'Responsible'],
        datasets: [
            {
                data: [9, 6, 5, 5],
                backgroundColor: [
                    '#DB4437',
                    '#F4B400',
                    '#66BB6A',
                    '#42A5F5'
        
                ],
                hoverBackgroundColor: [
                    '#DE564B',
                    '#FFBE6D',
                    '#81C784',
                    '#64B5F6'
                ]
            }
        ]
    };
    
    useEffect( () => {
        console.log('id===>', id);
        if(id) {
            console.log('id=2==>', id);}
          const testId = id;
          const fetchData = async (id) => {
            console.log('function called',id);
            const testResultData = await TestDataService.getTest(id);
            const testData = testResultData.data ;
            // setTestData(testResultData.data);
            console.log('testData', testData);
            console.log('before ====>');
            console.log('testResultData====>', testResultData);
            console.log('testResultData====>', testResultData.data);
            console.log('after ====>');
            console.log('testResultData.data.tags====>', testResultData.data.tags);
            const pieValue = [];
            testData.tagsBucket.map((tb) => {
                            pieValue.push(tb.answerCount);
                        });
            console.log('testData.data====>', testData);
            const pieLabels = testData.tags;
            console.log('pieLabels====>', pieLabels); 
            console.log('pieValue====>', pieValue);
            chartData = {
                labels: pieLabels,
                datasets: [
                    {
                        data: pieValue,
                        backgroundColor: [
                            '#DB4437',
                            '#ff9c38',
                            '#F4B400',
                            '#66BB6A',
                            '#42A5F5',
                            '#be68be'
                        ],
                        hoverBackgroundColor: [
                            '#DE564B',
                            '#FFBE6D',
                            '#FFB74D',
                            '#81C784',
                            '#64B5F6',
                            '#EE82EE'
                        ]
                    }
                ]
            };
          }
        fetchData(id);

    }, []);


    const lightOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    };

    return (
        <Container >
        <Box sx={{ height: '100vh' }}>
        <br/>
        <br/>
        <div style={{'display' : 'flex', 'columnGap' : '10px'}}>
        <InfoImage>
        <img src={userIcon} height='100px' width='100px' style={{borderRadius: '50%'}}></img>
        </InfoImage>
            <div style={{'marginTop' : '20px'}}>
                <InfoName>Ojas
                </InfoName>
                <br/>
                <p>Facebook</p>
            </div>
        </div>
        <div style={{
            // 'background' : ''
            'marginTop' : '60px'
        }}>
            <h4 style={{'fontWeight' : 'bold'}}>Results</h4>
            <br/>
            <div style={{
                'display' : 'flex', 
                'justifyContent' : 'center',
                'columnGap' : '60px',
                'background' : 'white',
                'padding' : '15px'
            }}>
                <h4 style={{'fontWeight' : 'bold'}}>PICT BE PROJECT DEMO</h4>
                <h4 style={{'color' : 'green','fontWeight' : 'bold'}}>No of Questions Attempted : 10</h4>
                
                {/* <h4 style={{'color' : 'violet', 'fontWeight' : 'bold'}}>Review : 0</h4> */}
            </div>
            <br/>
            <div style={{
                'background' : 'white',
                'padding' : '20px'
            }}>
                <h4 style={{'fontWeight' : 'bold'}}>Analysis</h4>
                <br/><br/>
                <div style={{
                    display:'flex', 
                    justifyContent : 'center'
                }}>
                <Chart type='pie' data={chartData} options={lightOptions} style={{ 
                    width: '35%' 
                    }} />
            </div>
            </div>
        </div>
        </Box>
        </Container>
    )
}

export default TestResult;