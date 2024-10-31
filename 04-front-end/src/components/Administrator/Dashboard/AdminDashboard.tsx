import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Using two columns for layout */}
        {[
          { title: "Categories", link: "/admin/dashboard/category/list" },
          { title: "Pages", link: "/admin/dashboard/pages/list" },
          { title: "Gallery", link: "/admin/dashboard/gallery/list" },
          { title: "Messages", link: "/admin/dashboard/messages/list" },
          {
            title: "Administrators",
            links: [
              { link: "/admin/dashboard/administrator/list", label: "List all administrators" },
              { link: "/admin/dashboard/administrator/add", label: "Add new administrator" },
            ],
          },
        ].map((item, index) => (
          <div key={index} className="col-12 col-md-6 p-3"> {/* Changed to col-md-6 for two columns */}
            <div className="card shadow-sm border-dark">
              <div className="card-header bg-dark text-white"> {/* Changed to black background */}
                <h5 className="mb-0">{item.title}</h5>
              </div>
              <div className="card-body d-grid gap-3">
                {item.links ? (
                  item.links.map((subItem, subIndex) => (
                    <Link key={subIndex} className="btn btn-secondary" to={subItem.link}>
                      {subItem.label}
                    </Link>
                  ))
                ) : (
                  <Link className="btn btn-secondary" to={item.link}>
                    List all {item.title.toLowerCase()}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
