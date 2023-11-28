const express = require('express')
const { Op, json } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Spot, Review, SpotImage } = require('../../db/models');
const spot = require('../../db/models/spot');

const router = express.Router();

const defaultSpots = async (req, res, next) => {
    const spots = []
    const preSpots = await Spot.findAll();

    for (let i = 0; i < preSpots.length; i++) {
        let spot = preSpots[i];
        const reviewsSum = await Review.sum( 'stars', {
            where: {
                spotId: spot.id
            }
        });

        const reviewsCount = await Review.count({
            where: {
                spotId: spot.id
            }
        });

        const avgRating = reviewsSum / reviewsCount;

        const previewImage = await SpotImage.findByPk(spot.id, {
            attributes: ['url']
        })

        spot = spot.toJSON();
        spot.avgRating = avgRating;
        spot.previewImage = previewImage;

        spots.push(spot)
    }

    return res.json({spots})
}

router.get('/', defaultSpots);

router.get('/current', async (req, res, next) => {
    const { user } = req;
      if (user) {
        const spots = []
        const preSpots = await Spot.findAll({
            where: {
                ownerId: user.id
            }
        });

        for (let i = 0; i < preSpots.length; i++) {
            let spot = preSpots[i];
            const reviewsSum = await Review.sum( 'stars', {
                where: {
                    spotId: spot.id
                }
            });

            const reviewsCount = await Review.count({
                where: {
                    spotId: spot.id
                }
            });

            const avgRating = reviewsSum / reviewsCount;

            const previewImage = await SpotImage.findByPk(spot.id, {
                attributes: ['url']
            })

            spot = spot.toJSON();
            spot.avgRating = avgRating;
            spot.previewImage = previewImage;

            spots.push(spot)
        }

        return res.json({spots})
    } else {
        return res.status(401).json({"message": "Authentication required"})
    }
});

router.get('/:spotId', async (req, res, next) => {
    const { spotId } = req.params;

    let spot = await Spot.findByPk(spotId);
       if (spot) {
    const reviewsSum = await Review.sum( 'stars', {
        where: {
            spotId
        }
    });

    const reviewsCount = await Review.count({
        where: {
            spotId
        }
    });

    const avgRating = reviewsSum / reviewsCount;

    spot = spot.toJSON();

    spot.numReviews = await Review.count({
        where: {
            spotId
        }
    })
    spot.avgRating = avgRating;
    spot.SpotImages = await SpotImage.findAll({
        where: {
            spotId
        },
        attributes: ['id', 'url', 'preview']
    })
    spot.Owner = await User.findByPk(spot.ownerId,{
        attributes: ['id', 'firstName', 'lastName']
    });

    return res.json(spot)
} else { return res.status(404).json({"message": "Spot couldn't be found"})}

})


module.exports = router;
