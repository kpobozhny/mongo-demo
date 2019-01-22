const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB..', err));

const courseSchema = new mongoose.Schema({
    tags: [String],
    date: {type: Date, default: Date.now},
    name: String,
    author: String,
    isPublished: Boolean,
    price: Number
})
const Course = mongoose.model('course', courseSchema);

async function getCourses(){
    
        return await Course
        .find({ isPublished: true})
        .or([
            {price: {$gte: 15}},
            {name: /.*by.*/i} ])
        .select('name author price'); 
        console.log(courses);
    }
    
    async function run(){
        const courses = await getCourses();
        console.log(courses);    
    }

    run();