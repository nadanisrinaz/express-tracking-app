const HttpError = require('../models/http-error')
const uuid = require('uuid')
const { validationResult } = require('express-validator')
const getCoordinates = require('../util/location')
let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world',
        location: {
            lat: 40,
            lng: 20
        },
        address: "aaa",
        creator: "u1"
    },
    {
        id: 'p2',
        title: 'Home',
        description: 'One of the most comfort',
        location: {
            lat: 10,
            lng: 10
        },
        address: "bbb",
        creator: "u2"
    }
]

const getAll = (req, res, next) => {
    res.json(DUMMY_PLACES)
}

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId
    })

     if(!place){
        return next(new HttpError('Could not find a place for the provided id.',404));
    }

    // if(!place){
    //     return res.status(404).json({ message : 'Could not find a place for the provided id.' })
    // }

    res.json({ place: place }); // => { place } => { place: place }
}
const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid

    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId
    })

    if(!place || place.length === 0){
        return next(new HttpError('Could not find a place for the provided user id.',404));

    }

    // if(!place){
    //     // res.status(404).json({ message: 'Could not find a place for the provided id.' })
    //     const error = new Error ('Could not find a place for the provided user id.');
    //     error.code = 404;
    //     return next(error)
    // }

    res.json({ place: place })
}

const createPlace = async (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        next(new HttpError('Data could not be Empty',422))
    }
    const { title, description, coordinates, address, creator } = req.body;

    let coordinatesFromMap;
    try {
        coordinatesFromMap = await getCoordinates(address)
    } catch (error) {
        next(error)
    }
    const createdPlace = {
        id: uuid.v4(),
        title: title,
        description: description,
        location: coordinatesFromMap,
        address: address,
        creator: creator
    }
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({place: createdPlace})
} 

const updatePlaceById = (req, res, next) => {
    const { title, desc } = req.body
    const { placeId } = req.params
    const updatedData = { ...DUMMY_PLACES.find(item => item.id === placeId) }
    updatedData.title = title;
    updatedData.desc = desc;
    const idPlace = DUMMY_PLACES.findIndex(item => item.id === placeId);
    DUMMY_PLACES[idPlace] = updatedData;

    res.status(200).json({place : DUMMY_PLACES})

}

const deletePlaceById = (req, res, next) => {
    const { placeId } = req.params
    const idPlace = DUMMY_PLACES.findIndex(item => item.id === placeId);
    DUMMY_PLACES.splice(idPlace,1)

    res.status(200).json({place : DUMMY_PLACES})
}

exports.getAll = getAll;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;