const mongoose = require('mongoose');
const objId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    name : { type : String, required : true },
    email : { type : String, unique : true, required : true },
    password : {type : String, required : true },
    groups : [{type : objId, ref : 'Group'}],
    posts : [{type : objId, ref: 'Post'}],
    comments : [{type : objId, ref : 'Comment'}]
});

const User = mongoose.model("User", UserSchema);

const GroupSchema = new mongoose.Schema({
    name : { type: String, unique : true, required : true },
    owner: { type : objId, ref : 'User'},
    description : String,
    posts : [{type : objId, ref: 'Post'}],
    members : [{ type : objId, ref : 'User'}],
    rules : [{type : String}]
});

GroupSchema.post("save", (doc, next) => {
    User.findByIdAndUpdate(doc.owner, {$push : {"groups" : doc._id}}).exec();
    next();
});

GroupSchema.pre("remove", (next) => {
    User.findByIdAndUpdate(this.owner, {$pull : {"groups" : this._id}}).exec();
    for(let i = 0; i < this.posts.length; i++){
        Post.remove({_id : this.posts[i]._id}).exec();
    }
    next();
});

const Group = mongoose.model("Group", GroupSchema);

const PostSchema = new mongoose.Schema({
    title : { type : String, required : true },
    group : { type : objId, required : true, ref : 'Group' },
    body : String,
    poster : { type : objId, required : true, ref : 'User'},
    comments : [{type : objId, ref : 'Comment'}]
}, {
    timestamps : true
});

PostSchema.post("save", (doc, next) => {
    User.findByIdAndUpdate(doc.poster, {$push : {"posts" : doc._id}}).exec();
    Group.findByIdAndUpdate(doc.group, {$push : {"posts" : doc._id}}).exec();
    next();
});

PostSchema.pre("remove", (next) => {
    Group.findByIdAndUpdate(this.group, {$pull : {"groups" : this._id}}).exec();
    User.findByIdAndUpdate(this.poster, {$pull : {"posts" : this._id}}).exec();
    for(let i = 0; i < this.comments.length; i++){
        Comment.remove({_id : this.comments[i]._id}).exec();
    }
    next();
});

const Post = mongoose.model("Post", PostSchema);

const CommentSchema = new mongoose.Schema({
    post : { type : objId, required : false, ref : 'Post' },
    parent: { type : objId, required : false, ref : 'Comment'},
    owner : { type : objId, required : true, ref : 'User' },
    comment : { type : String, required : true, ref : 'Comment' },
    children : [{ type : objId, ref : 'Comment' }]
}, {
    timestamps : true
});

CommentSchema.post("save", (doc, next) => {
    if(doc.parent){
        Comment.findByIdAndUpdate(doc.parent, {$push : {"children" : doc._id}}).exec();
    } else {
        Post.findByIdAndUpdate(doc.post, {$push : {"comments" : doc._id}}).exec();
    }
    User.findByIdAndUpdate(doc.poster, {$push : {"comments" : doc._id}}).exec();
    next();
});

CommentSchema.pre("remove", (next) => {
    if(this.parent){
        Comment.findByIdAndUpdate(this.parent, {$pull : {"children" : this._id}}).exec();
    } else {
        Post.findByIdAndUpdate(this.post, {$pull : {"comments" : this._id}}).exec();
    }
    for(let i = 0; i < this.children.length; i++){
        Comment.remove({_id : this.children[i]._id}).exec();
    }
    User.findByIdAndUpdate(this.poster, {$pull : {"comments" : doc._id}}).exec();
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = {
    User : User,
    Group : Group,
    Post : Post,
    Comment : Comment
};
