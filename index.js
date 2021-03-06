const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB..', err))

const courseSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255
        //match: /pattern/    
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        trim: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, callback) {
                setTimeout(() => {
                    // Do some async work
                    const result = v && v.length > 0;
                    callback(result);
                }, 2000)
            }, 
            message: 'A course should have at least one tag.'
        }

    },
    date: {type: Date, default: Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished;},
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)

    }
})
const Course = mongoose.model('Course', courseSchema);

async function createCourse(){

    const course = new Course({
        name: 'Angular Course',
        category: '  Web ',
        author: 'Sam',
        tags: ['frontend'],
        isPublished: true,
        price: 10.23
    });
    try {
        const result = await course.save();
        console.log(result);
    }
    catch (ex) {
        for (field in ex.errors)
        console.log(ex.errors[field].message);
    }

}

createCourse();

async function getCourses(){
// eq (equal)
// ne (not equal)
// gt (greater than)
// gte (greater than or equal to)
// lt (less than)
// lte (less than or equal to)
// in
// nin (not in)

    const pageNumber = 2;
    const pageSize = 10;

    const courses = await Course
    //.find({author:'Mosh', isPublished: true })
    //.find({ price: {$gte: 10, $lte: 20 } })
    //.find({price: {$in: [10, 15, 20] } })
    //.find()
    //.or([{author:'Mosh'}, {isPublished: true}])

    // Starts with Mosh
    .find({author: /^Mosh/})

    // Ends with Hamedani
    .find({author: /Hamedani$/})

    // Contains Mosh
    .find({ author: /.*Mosh.*/})
    .skip((pageNumber - 1) * pageSize) // fet documents on the given page
    .limit(pageSize) 
    .sort({name: 1})
    .select({name:1, tags:1}); // .count() - to get count of documents 
    console.log(courses);
}

//getCourses();

async function updateCourse(id) {
    const course = await Course.findById(id);
    if (!course) return;
    course.isPublished=true;
    course.author = 'Another Author';
    const result = await course.save();
    console.log(result);
    
    //Another approach
    /*course.set(
        {
            isPublished: true,
            author: 'Another Author'
        }
    );
    */

}

async function updateCourseUpdateFirstApproach(id) {
    const result = await Course.update({ _id: id}, {
        $set: {
            author: 'Mosh W.',
            isPublished: false
        }
    });

    console.log(result);
    
}

async function updateCourseUpdateFirstApproach2(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Sam',
            isPublished: false
        }
    }, { new: true});

    console.log(course);
    
}

async function removeCourse(id) {
    //const result = await Course.deleteOne({ _id: id});
    //const result = await Course.deleteMany({ _id: id});
    const course = await Course.findByIdAndRemove(id);
    console.log(course);

}

//updateCourse('5c47317ea532c8313c1319e9');
//removeCourse('5c47317ea532c8313c1319e9');

