import axios from "axios";

class TestQuestionDataService {

    // Create a Single TestQuestion
    createTestQuestion (newTestQuestion) {
        console.log('newTestQuestion:==>', newTestQuestion);
        return axios.post('testQuestions', newTestQuestion);
    }

    getAll() {
        return axios.get('all-questions');
    }
    
    // Add multiple TestQuestions in Batch
    createTestQuestionsBatch (newTestQuestionsArray) {
        return axios.post('testQuestions/addBatch', newTestQuestionsArray);
    }

    // Update a Single TestQuestion
    updateTestQuestion (id, updatedTestQuestion) {
        return axios.put(`testQuestions/${id}`, updatedTestQuestion);
    }

    // Delete a Single TestQuestion
    deleteTestQuestion (id, updatedTestQuestion) {
        updatedTestQuestion.isActive = false;
        return axios.put(`testQuestions/${id}`, updatedTestQuestion);
    }

    // Remove a Single TestQuestion
    removeTestQuestion (id) {
        return axios.delete(`testQuestions/${id}`);
    }

    // Get a Single TestQuestion by TestQuestion Id
    getTestQuestion (id) {
        return axios.get(`testQuestions/${id}`);
    }

    getQueryString(testId, sort, page, size) {
        if(testId !== undefined && testId.trim() !== ''){
            testId = testId.trim();
        }
        var search='';
        if(testId !== undefined && testId !== ''){
            search = 'testId=' + testId;
        }
        if(sort!==undefined && sort.length > 0){
            const sorts = JSON.stringify(sort);
            search = search + '&sort=' + sorts;
        }
        search = search + '&page=' + page;
        search = search + '&size=' + size; 
        if(search !== '') {
            search = '?' + search;
        }
        return search;
    }

    // Get all TestQuestions
    getAllTestQuestions (testId, sort, page = 0, size = 10) {
        var search = this.getQueryString(testId, sort, page, size);
        console.log('search:', search);
        return axios.get(`testQuestionsByPage${search}`);
    }
}

export default new TestQuestionDataService();
