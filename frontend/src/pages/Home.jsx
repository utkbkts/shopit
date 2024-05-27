import React, { useEffect } from "react";
import MetaData from "../layouts/Helmet";
import { useGetProductsQuery } from "../redux/api/ProductApi";
import ProductItem from "../components/ProductItem";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import CustomPagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import Filters from "../components/Filters";
const Home = () => {
  let [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const search = searchParams.get("search") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");

  const params = { page, search };

  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);

  const { data, isLoading, isError, error } = useGetProductsQuery(params);
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  if (isLoading) {
    return <Loader />;
  }
  const columnSize = search ? 4 : 3;
  return (
    <>
      <MetaData title={"Buy Best Product Online"} />
      <div className="">
        <div className="row d-flex justify-content-center">
          <div className="col-3 mt-5">
            <Filters />
          </div>
          <div className="col-9">
            <h1 id="products_heading" className="text-secondary">
              {search
                ? `${data?.products?.length} Products found with keyword:${search}`
                : "Latest Products"}
            </h1>
            <section id="products" className="mt-5">
              <div className="row">
                {data?.products?.map((product) => (
                  <ProductItem
                    key={product._id}
                    product={product}
                    columnSize={columnSize}
                  />
                ))}
              </div>
            </section>
            <CustomPagination
              resPerPage={data?.resPerPage}
              filteredProductsCount={data?.FilteredProductCount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
