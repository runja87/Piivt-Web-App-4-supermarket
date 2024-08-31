import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return(
<div className="row">

        <div className="col-12 col-md-4 p-3 ">
            <div className="card">
                <div className="card-title">Categories</div>
                    <div className="card-text d-grid gap-3">
                    <Link className="btn btn-dark" to="/admin/dashboard/category/list">List all categories</Link>
                    </div>
            </div>
        </div>



        <div className="col-12 col-md-4 p-3 ">
            <div className="card">
                <div className="card-title">Pages</div>
                    <div className="card-text d-grid gap-3">
                    <Link className="btn btn-primary" to="/admin/dashboard/page/list">List all pages</Link>
                    </div>
            </div>
        </div>

        <div className="col-12 col-md-4 p-3 ">
            <div className="card">
                <div className="card-title">Gallery</div>
                    <div className="card-text d-grid gap-3">
                    <Link className="btn btn-primary" to="/admin/dashboard/gallery/list">List all photos</Link>
                     </div>
            </div>
        </div>



        <div className="col-12 col-md-4 p-3 ">
            <div className="card">
                <div className="card-title">Messages</div>
                    <div className="card-text d-grid gap-3">
                    <Link className="btn btn-primary" to="/admin/dashboard/messages/list">List all messages</Link>
                     </div>
            </div>
        </div>


        <div className="col-12 col-md-4 p-3 ">
            <div className="card">
                <div className="card-title">Administrators</div>
                    <div className="card-text d-grid gap-3">
                    <Link className="btn btn-primary" to="/admin/dashboard/administrator/list">List all administrators</Link>
                    <Link className="btn btn-primary" to="/admin/dashboard/administrator/add">Add new administrator</Link>
                    </div>
            </div>
        </div>

</div>


 );
    
}