const mongoose = require('mongoose');
const schema = require('./../schema');
const Group = schema.Group;
const Post = schema.Post;
const Comment = schema.Comment;
const User = schema.User;
const OIDType = mongoose.Types.ObjectId;
const path = require('path');
const appDir = path.dirname(require.main.filename);

/**
 * @function Endpoint for creating and modifying groups
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.saveGroup = (req, res) => {
    let gObj = req.body;
    let currentUID = req.session.uid;
    gObj.name = gObj.name.split(' ').join('');
    if(gObj._id){
        Group.findOneAndUpdate({ _id : OIDType(gObj._id), owner : currentUID}, {$set : gObj}, (err, doc) => {
            if(err){
                console.error(err);
                res.status(500).json({message : 'An error occurred updating the group', data : doc});
            } else {
                res.json({message : 'Group updated', data : doc});
            }
        });
    } else {
        gObj.owner = currentUID;
        gObj.posts = [];
        if(!gObj.members){
            gObj.members = new Array(currentUID);
        } else {
            gObj.members.push(currentUID);
        }
        Group.create(gObj, (err, doc) => {
            if(err){
                console.error(err);
                res.status(500).json({message : 'An error occurred updating the group', data : doc});
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
    Group.findOne({_id : groupId, owner : currentUID}, (err, doc) => {
        if(err){
            console.error(err);
            res.status(500).json({message : 'An error occurred removing the group', data : doc});
        } else {
            doc.remove((err, removed) => {
                if(err){
                    res.status(500).json({message : 'An error occurred removing the group', data : removed});
                } else {
                    res.json({message : 'Group removed', data : removed});
                }
            });
        }
    });
};

/**
 * @function Endpoint for getting group info by group name
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.getGroupDetails = (req, res) => {
    let groupName = req.query.groupName;
    Group.findOne({name : groupName}, (err, doc) => {
        if(err){
            console.error(err);
            res.status(500).json({message : 'An error occurred getting group data', data : doc});
        } else {
            res.json({message : 'Got group data', data : doc});
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
    let pObj = req.body;
    let currentUID = req.session.uid;
    if(pObj._id){
        Post.findOneAndUpdate({ _id : OIDType(pObj._id), poster : currentUID}, {$set : pObj}, (err, doc) => {
            if(err){
                console.error(err);
                res.status(500).json({message : 'An error occurred updating the post', data : doc});
            } else {
                res.json({message : 'Post updated', data : doc});
            }
        });
    } else {
        pObj.poster = currentUID;
        if(req.files){
            pObj.fType = req.files.pFile.name.split('.')[1];
        }
        Group.findOne({name : pObj.groupName}, function(err, doc){
            pObj.group = doc._id;
            Post.create(pObj, (err, doc) => {
                if(err){
                    console.error(err);
                    res.status(500).json({message : 'An error occurred creating the post', data : doc});
                } else {
                    if(req.files){
                        let uploadedFile = req.files.pFile;
                        uploadedFile.mv(appDir + '/public/files/' + doc._id + '.' + uploadedFile.name.split('.')[1], (err) => {
                            res.json({message : 'Post created', data : doc});
                        });
                    } else {
                        res.json({message : 'Post created', data : doc});
                    }
                }
            });
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
    Post.findOne({_id : postId, poster : currentUID}, (err, doc) => {
        if(err){
            console.error(err);
            res.status(500).json({message : 'An error occurred removing the post', data : doc});
        } else {
            doc.remove((err, removed) => {
                if(err){
                    res.status(500).json({message : 'An error occurred removing the post', data : removed});
                } else {
                    res.json({message : 'Post removed', data : removed});
                }
            });
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
    let cObj = req.body;
    let currentUID = req.session.uid;
    if(cObj._id){
        Comment.findOneAndUpdate({ _id : OIDType(cObj._id), poster : currentUID}, {$set : cObj}, (err, doc) => {
            if(err){
                console.error(err);
                res.status(500).json({message : 'An error occurred updating the comment', data : doc});
            } else {
                res.json({message : 'Comment updated', data : doc});
            }
        });
    } else {
        cObj.owner = currentUID;
        cObj.children = [];
        Comment.create(cObj, (err, doc) => {
            if(err){
                console.error(err);
                res.status(500).json({message : 'An error occurred updating the comment', data : doc});
            } else {
                User.populate(doc, 'owner', (err, doc) => {
                    if(err){
                        console.error(err);
                        res.status(500).json({message : 'An error occurred creating the comment', data : doc});
                    } else {
                        res.json({message : 'Comment created', data : doc});
                    }
                });
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
    let commentId = OIDType(req.body.commentId);
    let currentUID = OIDType(req.session.uid);
    Comment.findOne({_id : commentId, owner : currentUID}, (err, doc) => {
        if(err){
            console.error(err);
            res.status(500).json({message : 'An error occurred removing the comment', data : doc});
        } else {
            doc.remove((err, removed) => {
                if(err){
                    res.status(500).json({message : 'An error occurred removing the comment', data : removed});
                } else {
                    res.json({message : 'Post removed', data : removed});
                }
            });
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
    let currentUID = OIDType(req.session.uid);
    let groupId = req.body.groupId;
    Group.findByIdAndUpdate(groupId, {$push : {"members" : currentUID}}, (err, doc) => {
        if(err){
            console.error(err);
            res.status(500).json({message : 'An error occurred joining the group', data : doc});
        } else {
            User.findByIdAndUpdate(currentUID, {$push : {"groups" : groupId}}, (err, doc) => {
                if(err){
                    res.status(500).json({message : 'An error occurred joining the group', data : doc});
                } else {
                    res.json({message : `Joined group`, data : doc});
                }
            });
        }
    });
};

/**
 * @function Endpoint for leaving a group
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.leaveGroup = (req, res) => {
    let currentUID = OIDType(req.session.uid);
    let groupId = req.body.groupId;
    Group.findByIdAndUpdate(groupId, {$pull : {"members" : currentUID}}, (err, doc) => {
        if(err){
            console.error(err);
            res.status(500).json({message : 'An error occurred leaving the group', data : doc});
        } else {
            User.findByIdAndUpdate(currentUID, {$pull : {"groups" : groupId}}, (err, doc) => {
                if(err){
                    res.status(500).json({message : 'An error occurred leaving the group', data : doc});
                } else {
                    res.json({message : `Left group`, data : doc});
                }
            });
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
    let currentUID = OIDType(req.session.uid);
    Group.find({members : currentUID}, (err, doc) => {
        if(err){
            console.error(err);
            res.status(500).json({message : 'An error occurred finding the groups', data : doc});
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
    Group.find({ private : false }, (err, doc) => {
        if(err){
            console.error(err);
            res.status(500).json({message : 'An error occurred finding the groups', data : doc});
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
    let groupName = req.query.groupName;
    Group.findOne({name : groupName}).populate('posts', '_id title comments createdAt', null, { sort: { 'createdAt': -1 } }).exec(function(err, doc){
        if(err){
            console.error(err);
            res.status(500).json({message : 'An error occurred finding the posts', data : doc});
        } else {
            if(!doc){
                res.status(500).json({message : 'No group found with that name', data : doc});
            } else {
                res.json({message : `Found ${doc.posts.length} posts`, data : doc});
            }
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
exports.getPostDetails = (req, res) => {
    let postId = OIDType(req.query.postId);
    Post.findById(postId).populate('comments').exec((err, doc) => {
        if(err){
            res.status(500).json({message : 'An error occurred finding the post', data : doc});
        } else {
            Post.populate(doc, {path : 'comments.owner', model : 'User'}, (err, doc2) => {
                if(err){
                    res.status(500).json({message : 'An error occurred finding the post', data : doc2});
                } else {
                    res.json({message : `Got post information`, data : doc2});
                }
            });
        }
    });
};


/**
 * @function Endpoint for getting the current user id based on the session
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.getUserId = (req, res) => {
    res.send(req.session.uid);
};

/**
 * @function Endpoint for getting a list of users
 * @param {object} req
 *   The express HTTP request containing the information required for the function
 * @param {object} res
 *   The express HTTP response to be sent back to the requester
 */
exports.getUsers = (req, res) => {
    User.find({}, "_id email name",(err, doc) => {
        if(err){
            res.status(500).json({message : 'An error occurred finding the users', data : doc});
        } else {
            res.json({message : `Got users`, data : doc});
        }
    });
};


