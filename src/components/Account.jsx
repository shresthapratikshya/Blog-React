import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { db } from './../config/firebase'
import "../css/account.css"

const Account = () => {
    //creation
    const [blogList, setBlogList] = useState({
        title: "",
        description: "",
        category: ""
    });

    const { title, description, category } = blogList;
    const blogCollection = collection(db, "blogs");
    const submitBlog = async () => {
        try {
            const res = await addDoc(blogCollection, { title: title, description: description, category: category });
            if (res) {
                alert("Published");
            }
            displayBlogs();
        } catch (error) {
            console.log(error);
        }
    };

    //display
    const [display, setDisplay] = useState([]);
    const blogDisplay = collection(db, "blogs"); //gets the collection from blogs database
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
    }

    useEffect(() => {
        displayBlogs();
    }, []);

    //deletion
    const deleteBlog = async (id) => {
        const blogDoc = doc(db, "blogs", id);
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
    const [updateValues, setUpdateValues] = useState({
        title: "",
        description: "",
        category: ""
    }); //to store update values

    const [blogId, setBlogId] = useState(0);
    //first call from edit button
    const updateBlogList = (id) => {
        setBlogId(id);
        setUpdateValues({ //when new blog is called, this will reset the updateValues
            title: "",
            description: "",
            category: ""
        });
        setUpdatedBlogData(true);
        // setBlogList({ ...blogList });
        // setBlogList(display.filter(blog => blog.id === id)[0]); // to set the current blog data in the form
        // console.log("Updated=", id);
    }

    const changeBlogList = async () => {
        const blogDoc = doc(db, "blogs", blogId); //problem
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
                <button type='submit' onClick={submitBlog}>Publish</button>
            </div>
            <div className='account-blogs'>
                {display && display.map((blog) => (
                    <div className='blog-section' key={blog.id}>
                        <h1>{blog.title}</h1>
                        <h3><b className='category-display'>Category: </b>{blog.category}</h3>
                        <p>{blog.description}</p>
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
                                <button className='edit-button' onClick={() => changeBlogList()}>UPDATE</button>
                            </div>}
                    </div>
                ))}
            </div>
        </div >
    )
}

export default Account
