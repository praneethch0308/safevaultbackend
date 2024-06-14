const express = require('express')
const fetchuser = require('../middlewares/fetchuser')
const router = express.Router()
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');

//ROUTE1: Get all the Notes using: Get "/api/note/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req,res)=>{

    try {
        const notes = await Note.find({user: req.user.id})
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }

})

//ROUTE2: Add a new Note using: POST "/api/note/addnotes". Login required
router.post('/addnotes', fetchuser,[
    body('title', 'Title is required').isLength({ min: 1 }),
    body('description', 'Notes is required').isLength({ min: 1 }),
], async (req,res)=>{

    try {
        const { title, description, tag }= req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }

})

//ROUTE3: Update an existing Note using: Get "/api/note/updatenote". Login required
router.put('/updatenote/:id', fetchuser,[
    
], async (req,res)=>{

    const { title,description } = req.body
    try {
        
        //Create a newNote object
        const newNote = {} 
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        
        //Find the note to be updated and update
        let note = await Note.findById(req.params.id)
        if(!note){return res.status(404).send("Not Found")}
        
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Access Denied")
        }
        
        // note = await note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note})
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }
})

//ROUTE4: Delete an existing Note using: DELETE "/api/note/deletenote". Login required
router.delete('/deletenote/:id', fetchuser,[
    
], async (req,res)=>{
    
    try { 
    //Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id)
    if(!note){return res.status(404).send("Not Found")}

    //Allow deletion only if user owns this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Access Denied")
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success": "The following note has been deleted", note: note})

    } catch (error) {
            
    }

})

module.exports = router 