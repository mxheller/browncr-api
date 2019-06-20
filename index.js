if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();
const config = JSON.parse(process.env.DB_CONFIG);

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const Review = require('./review.js')(sequelize, Sequelize.DataTypes);

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getCourseReviews = (req, res) => {
    // Set CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
    res.set("Access-Control-Max-Age", "3600");

    return Review
        .findAll({
            attributes: ["crn", "edition", "courseavg", "profavg"],
            where: {
                [Op.or]: JSON.parse(req.query.selectors)
            }
        })
        .then(reviews => {
            if (!reviews) {
                return res.status(404).send("Course not found");
            }
            return res.status(200).send(reviews);
        })
        .catch(error => res.status(400).send(error));
};