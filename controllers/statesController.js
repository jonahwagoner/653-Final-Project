const data = {
    states: require('../model/states.json'),
    setStates: function (data) { this.states = data }
}

const getAllStates = (req, res) => {
    res.json(data.states);
}

const createNewState = (req, res) => {
    const newState = {
        id: data.states?.length ? data.states[data.states.length - 1].id + 1 : 1,
        stateCode: req.body.stateCode,
        funfacts: req.body.funfacts
    }

    if (!newState.stateCode) {
        return res.status(400).json({ 'message': 'State Code is required.' });
    }

    data.setStates([...data.states, newState]);
    res.status(201).json(data.states);
}

const updateState = (req, res) => {
    const state = data.states.find(emp => emp.id === parseInt(req.body.id));
    if (!state) {
        return res.status(400).json({ "message": `State ID ${req.body.id} not found` });
    }
    if (req.body.stateCode) state.stateCode = req.body.stateCode;
    if (req.body.funfacts) state.funfacts = req.body.funfacts;
    const filteredArray = data.states.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, state];
    data.setStates(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.states);
}

const deleteState = (req, res) => {
    const state = data.states.find(emp => emp.id === parseInt(req.body.id));
    if (!state) {
        return res.status(400).json({ "message": `State ID ${req.body.id} not found` });
    }
    const filteredArray = data.states.filter(emp => emp.id !== parseInt(req.body.id));
    data.setStates([...filteredArray]);
    res.json(data.states);
}

const getState = (req, res) => {
    const state = data.states.find(emp => emp.id === parseInt(req.params.id));
    if (!state) {
        return res.status(400).json({ "message": `State ID ${req.params.id} not found` });
    }
    res.json(state);
}

module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState,
    getState
}