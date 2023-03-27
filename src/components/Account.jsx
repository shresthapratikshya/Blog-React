import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { db, storage } from './../config/firebase'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
import "../css/account.css"

const Account = () => {
    //creation
    const [blogList, setBlogList] = useState({ //data,setData
        title: "",
        description: "",
        category: "",
        image: null
    });

    const [file, setFile] = useState(null); //image upload
    const { title, description, category, image } = blogList;//data
    const blogCollection = collection(db, "users-blog");

    const submitBlog = async () => {
        const imageUploadRef = ref(storage, `images/${file.name + v4()}`); //v4 generates random letters to assign to the image because images should not have the same name
        try {
            const uploadTask = await uploadBytesResumable(imageUploadRef, file); //uploads the file in multiple requests
            const downloadURL = await getDownloadURL(uploadTask.ref); //retrieves the url for the file
            console.log("Image uploaded successfully");
            await addDoc(blogCollection, { title, description, category, image: downloadURL });
            console.log("Blog added successfully");
            alert("Published");
            displayBlogs();
            // const uploadTask = uploadBytesResumable(imageUploadRef, file); //upload file to the storage in multiple requests/ better than uploadBytes(single request, if failed then restart)
            // uploadTask.on("state_changed", //eventlistener
            //     (snapshot) => {  //callback function=> calls everytime state changes 
            //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //progress calculate while uploading file
            //         setProgress(progress); //sets the progress, haven't used progress for now
            //     },
            //     (error) => {
            //         console.log(error);
            //     },
            //     () => { //calls when the upload is complete
            //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //             setImageURL((prev) => ({ ...prev, imageURLName: downloadURL }));//retrieves download URL
            //             console.log("Image uploaded successfully");
            //             addDoc(blogCollection, { title, description, category, image: downloadURL })
            //                 .then(() => {
            //                     console.log("Blog added successfully");
            //                     alert("Published");
            //                     displayBlogs();
            //                 })
            //                 .catch((error) => {
            //                     console.error("Error adding blog: ", error);
            //                 });
            //         });
            //     }
            // );
            // const uploadTask = await uploadBytesResumable(imageUploadRef, file, {
            //     observer: {
            //         next: (snapshot) => {
            //             console.log("inside");
            //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //             setProgress(progress);
            //         },
            //         error: (error) => {
            //             console.log(error);
            //         },
            //         complete: () => {
            //             console.log("hello1");
            //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //                 console.log("hello2");

            //                 setImageURL((prev) => ({ ...prev, imageURLName: downloadURL }));
            //                 addDoc(blogCollection, { title: title, description: description, category: category, image: imageURLName }).then(() => {
            //                     console.log("Doc added Successfully");
            //                     alert("Published");
            //                     displayBlogs();

            //                 }).catch((error) => {
            //                     console.error("Error adding blog:", error);
            //                 })

            //             });
            //         }
            //     }
            // });
        } catch (error) {
            console.log(error);
        }
    };

    //display
    const [display, setDisplay] = useState([]);
    const blogDisplay = collection(db, "users-blog"); //gets the collection from blogs database
    const displayBlogs = async () => {
        try {
            const blogData = await getDocs(blogDisplay); //gives all the objects there are(unrequired)
            const filteredData = blogData.docs.map((doc) => ({ //filtering data to get only data that we need
                ...doc.data(), id: doc.id
            }));
            setDisplay(filteredData);
        } catch (error) {
            console.log(error);
        }
        // onSnapshot(blogDisplay, (snapshot) => { //callback when changes occur in blogDisplay
        //     let list = [];
        //     snapshot.docs.forEach((doc) => { //loops through each document
        //         list.push({ id: doc.id, ...doc.data() }) //adds it to array
        //     });
        //     setDisplay(list);
        //     // setFilterBlog(list);
        // }, (error) => {
        //     console.log("Error while displaying blogs ", error);
        // })

    }

    useEffect(() => {
        displayBlogs();
    }, []);

    //deletion
    const deleteBlog = async (id) => {
        const blogDoc = doc(db, "users-blog", id);
        try {
            await deleteDoc(blogDoc);
            alert("Blog Deleted");
            displayBlogs();
        } catch (error) {
            console.log(error);
        }
    }

    //update
    const [updateBlogData, setUpdatedBlogData] = useState(false);
    // const [updateFile, setUpdateFile] = useState([]);
    const [updateValues, setUpdateValues] = useState({
        title: "",
        description: "",
        category: "",
        image: ""
    }); //to store update values

    const [blogId, setBlogId] = useState(0);
    //first call from edit button
    const updateBlogList = (id) => {
        setBlogId(id);
        setUpdateValues({ //when new blog is called, this will reset the updateValues
            title: "",
            description: "",
            category: "",
            image: ""
        });
        setUpdatedBlogData(true);
        // setBlogList({ ...blogList });
        // setBlogList(display.filter(blog => blog.id === id)[0]); // to set the current blog data in the form
        // console.log("Updated=", id);
    }

    const changeBlogList = async () => {
        const blogDoc = doc(db, "users-blog", blogId); //problem
        console.log("Data has been updated successfully");
        try {
            await updateDoc(blogDoc, { title: updateValues.title, category: updateValues.category, description: updateValues.description });
            displayBlogs();
            setUpdatedBlogData(false);
            alert("Data has been updated");
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <div className='account-content'>
                <input type="text" placeholder='Title your blog...' className='blog-title' onChange={(e) => setBlogList({ ...blogList, title: e.target.value })}></input>
                <textarea rows="20" cols="20" placeholder='Write your blog...' className='blog-description' onChange={(e) => setBlogList({ ...blogList, description: e.target.value })}></textarea>
                <div className='category'>
                    <label className='blog-category'>Category</label>
                    <select name="category" className='blog-list' onChange={(e) => setBlogList({ ...blogList, category: e.target.value })}>
                        <option value="Popular">Popular</option>
                        <option value="Featured">Featured</option>
                    </select>
                </div>
                <input type="file" className='file-upload' label="Upload Image" onChange={(e) => setFile(e.target.files[0])}></input>
                <button type='submit' onClick={submitBlog}>Publish</button>
            </div>
            <div className='account-blogs'>
                {display && display.map((blog) => (
                    <div className='blog-section' key={blog.id}>
                        <h1>{blog.title}</h1>
                        <h3><b className='category-display'>Category: </b>{blog.category}</h3>
                        <div className='content-section'>
                            <img src={blog.image}></img>
                            <p>{blog.description}</p>
                        </div>
                        <div className='update-delete'>
                            <button className='update-button' onClick={() => updateBlogList(blog.id)} >EDIT</button>
                            <button className='delete-button' onClick={() => deleteBlog(blog.id)}>DELETE</button>
                        </div>
                        {updateBlogData === true && //edit section is displayed once the updateBlogData is true
                            <div className='edit-box'>
                                <input type="text" placeholder='title' className='edit-input' onChange={(e) => setUpdateValues({ ...updateValues, title: e.target.value })}></input>
                                <textarea rows="20" cols="20" placeholder='Write your blog...' className='blog-description' onChange={(e) => setUpdateValues({ ...updateValues, description: e.target.value })}></textarea>
                                <div className='category'>
                                    <label className='edit-category'>Category</label>
                                    <select name="category" className='blog-list' onChange={(e) => setUpdateValues({ ...updateValues, category: e.target.value })}>
                                        <option value="Popular">Popular</option>
                                        <option value="Featured">Featured</option>
                                    </select>
                                </div>
                                {/* <input type="file" className='file-upload' label="Upload Image" onChange={(e) => setUpdateFile(e.target.files[0])}></input> */}
                                <button className='edit-button' onClick={() => changeBlogList()}>UPDATE</button>
                            </div>}
                    </div>
                ))}
            </div>
        </div >
    )
}

export default Account
