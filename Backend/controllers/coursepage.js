const Course = require('../model/courses');
const User = require('../model/user');

exports.CoursePage = (req,res,next)=>{
    const courseName=req.params.courseName;
    const courseId=req.params.courseId;

    Course.findOne({_id:courseId})
    .then(course=>{
        res.status(200).json({course:course})
    })
    .catch(err=>{
        console.log(err)
    })

}

exports.Bookmark = (req,res,next)=>{
    const courseId=req.params.courseId;
    const courseName=req.params.courseName;
    const userId = req.body._userID;

    User.findById({_id:userId})
    .then(user=>{
        if(!user.Bookmark.includes(courseId)){
            user.Bookmark.push(courseId);
        }
        else{
            user.Bookmark.splice(user.Bookmark.indexOf(courseId),1);
        }
        user.save();
        res.status(202).json({message:"successfully bookmarked"})
    })  
    .catch(err=>{
        console.log(err)
    })
    Course.findById({_id:courseId})
    .then(course=>{
        if(!course.bookmark.includes(userId)){
            course.bookmark.push(userId);
            console.log("bookmarked")
        }
        else{
            course.bookmark.splice(course.bookmark.indexOf(userId),1);
        }
        course.save();
    })
    .catch(err=>{
        console.log(err);
    })

}

exports.ShowBookmark =(req,res,next)=>{
    const userId = req.params.userId;
    console.log("route hit")
    User.findById({_id:userId})
    .populate('Bookmark')
    .exec()
    .then(course=>{
        console.log(course)
        res.json({course:course})
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.unbookmark=(req,res,next)=>{
    const userId= req.body.userId;
    const courseId=req.body.id;

    User.findById({_id:userId})
    .then(user=>{
        user.Bookmark.splice(user.Bookmark.indexOf(courseId),1);
        user.save();
        res.status(200).json({message:"successfully unbookmarked"})
    })
    .catch(err=>{
        console.log(err)
    })

    Course.findById({_id:courseId})
    .then(course=>{
        course.bookmark.splice(course.bookmark.indexOf(userId),1);
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.rating=(req,res,next)=>{
    const courseId=req.body.courseId;
    const new_Rating=req.body.rating;

    Course.findById({_id:courseId})
    .then(course=>{
        const total_rating=course.rating.ratingSum+new_Rating;
        const times_updated=  course.rating.timesUpdated+1;
        course.rating.timesUpdated+=1;
        course.rating.ratingSum+=new_Rating;
        course.rating.ratingFinal= (total_rating/times_updated);
        
        course.save();
        console.log(course)
        res.status(200).json({course:course})
    })
    .catch(err=>{
        console.log(err);
    })

}