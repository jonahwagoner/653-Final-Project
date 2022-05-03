const data = {
    states: require('../model/states.json'),
    setStates: function (data) { this.states = data }
}

const State = require('../model/State');

const getAllStates = async (req, res) => {
    const contig = req.query?.contig;
    let stateFromJson
    if (contig === 'true') {
        stateFromJson = data.states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
        stateFromJson = data.states.filter(state => state.code === 'AK' || state.code === 'HI');
    } else {
        stateFromJson = data.states;
    }

    const statesInMongo = await State.find({}).exec();
    const statesToReturn = stateFromJson.map(state => {
        const stateFoundInMongo = statesInMongo.find(mongoState => mongoState.stateCode.toUpperCase() === state.code.toUpperCase());
        if (stateFoundInMongo?.funfacts) {
            return {...state, funfacts: stateFoundInMongo.funfacts};
        } else {
            return state;
        }
    });
    res.send(statesToReturn);
}

const addFunFact = async (req, res) => {
    const paramsCode = req.params.code.toUpperCase();
    const state = data.states.find(state => state.code === paramsCode);
    if (!state) {
        return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
    }
    const stateInMongo = await State.findOne({ stateCode: paramsCode }).exec();
    if (!stateInMongo) {
        try {
            const result = await State.create({
                stateCode: paramsCode,
                funfacts: req.body.funfacts
            });

            res.status(201).json(result);
        } catch (err) {
            console.error(err);
        }
    } else {
        try {
            stateInMongo.funfacts.push(...req.body.funfacts)
            const result = await stateInMongo.save();
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
        }
    }
}


const createNewState = (req, res) => {
    const newState = {
        id: data.states?.length ? data.states[data.states.length - 1].id + 1 : 1,
        stateCode: req.body.stateCode,
        funfacts: req.body.funfacts
    }

    if (!newState.stateCode) {
        return res.status(404).json({ 'message': 'State Code is required.' });
    }

    data.setStates([...data.states, newState]);
    res.status(201).json(data.states);
}

const updateState = (req, res) => {
    const state = data.states.find(state => state.id === parseInt(req.body.id));
    if (!state) {
        return res.status(404).json({ "message": `State ID ${req.body.id} not found` });
    }
    if (req.body.stateCode) state.stateCode = req.body.stateCode;
    if (req.body.funfacts) state.funfacts = req.body.funfacts;
    const filteredArray = data.states.filter(state => state.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, state];
    data.setStates(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.states);
}

const deleteState = (req, res) => {
    const state = data.states.find(emp => emp.id === parseInt(req.body.id));
    if (!state) {
        return res.status(404).json({ "message": `State ID ${req.body.id} not found` });
    }
    const filteredArray = data.states.filter(state => state.id !== parseInt(req.body.id));
    data.setStates([...filteredArray]);
    res.json(data.states);
}

const getState = async (req, res) => {
    const paramsCode = req.params.code.toUpperCase();
    let state = data.states.find(state => state.code === paramsCode);
    if (!state) {
        return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
    }
    const stateInMongo = await State.findOne({ stateCode: paramsCode }).exec();
    if (stateInMongo?.funfacts) {
        state = {...state, funfacts: stateInMongo.funfacts}
    }
    res.json(state);
}

const getStateCapital = (req, res) => {
    const paramsCode = req.params.code.toUpperCase();
    const state = data.states.find(state => state.code === paramsCode);
    if (!state) {
        return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
    }
    res.json({state: state.state, capital: state.capital_city});
}

const getStateNickname = (req, res) => {
    const paramsCode = req.params.code.toUpperCase();
    const state = data.states.find(state => state.code === paramsCode);
    if (!state) {
        return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
    }
    res.json({state: state.state, nickname: state.nickname});
}

const getStatePopulation = (req, res) => {
    const paramsCode = req.params.code.toUpperCase();
    const state = data.states.find(state => state.code === paramsCode);
    if (!state) {
        return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
    }
    res.json({state: state.state, population: state.population.toLocaleString()});
}

const getStateAdmission = (req, res) => {
    const paramsCode = req.params.code.toUpperCase();
    const state = data.states.find(state => state.code === paramsCode);
    if (!state) {
        return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
    }
    res.json({state: state.state, admitted: state.admission_date});
}

const getFunfact = async (req, res) => {
    const paramsCode = req.params.code.toUpperCase();
    const state = data.states.find(state => state.code === paramsCode);
    if (!state) {
        return res.status(404).json({ "message": `Invalid state abbreviation parameter` });
    }
    const stateInMongo = await State.findOne({ stateCode: paramsCode }).exec();
    if (!stateInMongo) {
        return res.status(404).json({ "message": `No Fun Facts found for ${state?.state}` });
    } else {
        const funfacts = stateInMongo.funfacts;
        const randomFact = funfacts[Math.floor(Math.random() * funfacts.length)];
        res.status(200).json({funfact: randomFact});
    }
}

module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState,
    getState,
    getStateAdmission,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    addFunFact,
    getFunfact
}