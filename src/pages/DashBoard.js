import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteTour, getToursByUser } from "../redux/features/tourSlice";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

export default function DashBoard() {

  const { user } = useSelector((state) => ({ ...state.auth }));
  const { userTours, loading } = useSelector((state) => ({ ...state.tour }));
  const loggeduser = JSON.parse(localStorage.getItem("loggedUser"))
  const userId = user.filter(user=> user.id == loggeduser.id)[0]?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(getToursByUser(userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const excerpt = (str) => {
    if (str.length > 40) {
      str = str.substring(0, 40) + " ...";
    }
    return str;
  };

  if (loading) {
    return <Spinner />;
  }
  
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tour ?")) {
      dispatch(deleteTour({ id, toast }));
    }
  };

  return (
    <>

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12 text-center ">
          <Link to={`/add`} href="#" className="card-link">Add Data</Link>
            {userTours.length === 0 && (
              <h3 className="text-center">No tour available with the user: {loggeduser.firstName}</h3>
             
            )}

            {userTours.length > 0 && (
              <>
                <h5 className="text-center">Dashboard: {loggeduser.firstName}</h5>
                <hr style={{ maxWidth: "570px" }} />
              </>
            )}
          </div>

          {userTours &&
            userTours.map((item,index) => (
              <div className='col-md-3' key={index}>
                <div className="card mb-3" >
                  <img src={item.imageFile} className="card-img-top img-thumbnail rounded" alt={item.title} />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text"> {excerpt(item.description)}</p>
                    <Link to={`/edit/${item.id}`} href="#" className="card-link">Edit</Link>
                    <Link  to="#" className="card-link" onClick={() => handleDelete(item.id)}>Delete</Link>
                    <Link to={`/view/${item.id}`} href="#" className="card-link">View</Link>
              
                  </div>
                </div>

              </div>
            ))}

        </div>
      </div>

    </>
  )
}
