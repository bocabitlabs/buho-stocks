import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { pathToRegexp } from "path-to-regexp";
import { Link, useLocation, useParams } from "react-router-dom";

interface IDict {
  [key: string]: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  let {id} = useParams<{id: string}>();
  console.log("Location:")
  console.log(location)

  const breadcrumbNameMap: IDict = {
    "/app/currencies": "Currencies",
    "/app/home": "Home",
    "/app/import-export": "Import & Export",
    "/app/settings": "Settings",
    "/app/markets": "Markets",
    "/app/markets/:id": id,
    "/app/markets/:id/edit": "Edit",
    "/app/portfolios": "Portfolios",
    "/app/portfolios/:id": id,
    "/app/profile": "Profile",
    "/app/sectors": "Sectors",
    "/app/sectors/:id": id
  };

  // const pathSnippets = location.pathname.split("/").filter((i) => i);
  const pathSnippets = location.pathname.split('/').filter(i => i);

  console.log(pathSnippets);
  // pathSnippets.shift();
  const extraBreadcrumbItems: any[] = [];
    pathSnippets.forEach((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      Object.keys(breadcrumbNameMap).forEach((item) => {
        console.log("ITEM:")
        console.log(item)
        console.log(url)
        console.log(pathToRegexp(item).test(url))
        if (pathToRegexp(item).test(url)) {
          extraBreadcrumbItems.push(<Breadcrumb.Item key={url}>
            <Link to={url}>
              {breadcrumbNameMap[item]}
            </Link>
          </Breadcrumb.Item>);
        }
      });
    });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/app/home"><HomeOutlined/></Link>
    </Breadcrumb.Item>
  ].concat(extraBreadcrumbItems);
  return (
    <div className="demo">
      <Breadcrumb style={{ margin: "16px 0" }}>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
