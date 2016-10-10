const mongoose = require('mongoose');
const schema = require('./../schema');
const Group = schema.Group;
const Post = schema.Post;
const Comment = schema.Comment;
const OIDType = mongoose.Schema.Types.ObjectId;

/**
 * @function Endpoint for creating and modifying groups
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.saveGroup = (req, res) => {
    let gObj = req.body.groupObject;
    let currentUID = req.session.uid;
    if(gObj._id){
        Group.update({ _id : OIDType(gObj._id), owner : currentUID}, {$set : gObj}, (err, doc) => {
            if(err){
                console.error(err);
                res.statusCode(500).json({message : 'An error occurred updating the group', data : doc});
            } else {
                res.json({message : 'Group updated', data : doc});
            }
        });
    } else {
        gObj.owner = currentUID;
        Group.create(gObj, (err, doc) => {
            if(err){
                console.error(err);
                res.statusCode(500).json({message : 'An error occurred updating the group', data : doc});
            } else {
                res.json({message : 'Group created', data : doc});
            }
        });
    }
};

/**
 * @function Endpoint for removing groups
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.removeGroup = (req, res) => {
    let groupId = req.body.groupId;
    let currentUID = req.session.uid;
    Group.remove({_id : groupId, owner : currentUID}, (err, doc) => {
        if(err){
            console.error(err);
            res.statusCode(500).json({message : 'An error occured removing the group', data : doc});
        } else {
            res.json({message : 'Group removed', data : doc});
        }
    });
};

/**
 * @function Endpoint for creating and modifying posts
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.savePost = (req, res) => {
    let pObj = req.body.postObject;
    let currentUID = req.session.uid;
    if(pObj._id){
        Post.update({ _id : OIDType(pObj._id), poster : currentUID}, {$set : pObj}, (err, doc) => {
            if(err){
                console.error(err);
                res.statusCode(500).json({message : 'An error occurred updating the post', data : doc});
            } else {
                res.json({message : 'Post updated', data : doc});
            }
        });
    } else {
        pObj.owner = owner;
        Post.create(pObj, (err, doc) => {
            if(err){
                console.error(err);
                res.statusCode(500).json({message : 'An error occurred updating the post', data : doc});
            } else {
                res.json({message : 'Post created', data : doc});
            }
        });
    }
};

/**
 * @function Endpoint for removing posts
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.removePost = (req, res) => {
    let postId = req.body.postId;
    let currentUID = req.session.uid;
    Post.remove({_id : postId, poster : currentUID}, (err, doc) => {
        if(err){
            console.error(err);
            res.statusCode(500).json({message : 'An error occurred removing the post', data : doc});
        } else {
            res.json({message : 'Post removed', data : doc});
        }
    });
};

/**
 * @function Endpoint for creating and modifying comments
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.saveComment = (req, res) => {
    let cObj = req.body.commentObject;
    let currentUID = req.session.uid;
    if(cObj._id){
        Comment.update({ _id : OIDType(cObj._id), poster : currentUID}, {$set : cObj}, (err, doc) => {
            if(err){
                console.error(err);
                res.statusCode(500).json({message : 'An error occurred updating the comment', data : doc});
            } else {
                res.json({message : 'Comment updated', data : doc});
            }
        });
    } else {
        cObj.owner = owner;
        Comment.create(cObj, (err, doc) => {
            if(err){
                console.error(err);
                res.statusCode(500).json({message : 'An error occurred updating the post', data : doc});
            } else {
                res.json({message : 'Comment created', data : doc});
            }
        });
    }
};

/**
 * @function Endpoint for removing comments
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.removeComment = (req, res) => {
    let commentId = req.body.commentId;
    let currentUID = req.session.uid;
    Comment.remove({_id : commentId, poster : currentUID}, (err, doc) => {
        if(err){
            console.error(err);
            res.statusCode(500).json({message : 'An error occurred removing the post', data : doc});
        } else {
            res.json({message : 'Post removed', data : doc});
        }
    });
};

/**
 * @function Endpoint for joining a group
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.joinGroup = (req, res) => {
    let currentUID = req.session.uid;
    let groupId = req.body.groupId;
    Group.findByIdAndUpdate(groupId, {$push : {"members" : currentUID}}, (err, doc) => {
        if(err){
            console.error(err);
            res.statusCode(500).json({message : 'An error occurred joining the group', data : doc});
        } else {
            res.json({message : `Joined group`, data : doc});
        }
    });
};

/**
 * @function Endpoint for getting groups the user is a member of
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.getUserGroups = (req, res) => {
    let currentUID = req.session.uid;
    Group.find({members : currentUID}, (err, doc) => {
        if(err){
            console.error(err);
            res.statusCode(500).json({message : 'An error occurred finding the groups', data : doc});
        } else {
            res.json({message : `Found ${doc.length} groups`, data : doc});
        }
    });
};

/**
 * @function Endpoint for getting all groups
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.getAllGroups = (req, res) => {
    Group.find({}, (err, doc) => {
        if(err){
            console.error(err);
            res.statusCode(500).json({message : 'An error occurred finding the groups', data : doc});
        } else {
            res.json({message : `Found ${doc.length} groups`, data : doc});
        }
    });
};

/**
 * @function Endpoint for getting all posts for a group
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.getPostsForGroup = (req, res) => {
    let groupId = OIDType(req.query.groupId);
    Post.find({group : groupId}, (err, doc) => {
        if(err){
            console.error(err);
            res.statusCode(500).json({message : 'An error occurred finding the posts', data : doc});
        } else {
            res.json({message : `Found ${doc.length} posts`, data : doc});
        }
    });
};

/**
 * @function Endpoint for getting all comments for a post
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.getCommentsForPost = (req, res) => {
    let postId = OIDType(req.query.postId);
    Comment.find({post : postId}, (err, doc) => {
        if(err){
            console.error(err);
            res.statusCode(500).json({message : 'An error occurred finding the comments', data : doc});
        } else {
            res.json({message : `Found ${doc.length} comments`, data : doc});
        }
    });
};


