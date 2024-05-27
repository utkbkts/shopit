import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import toast from "react-hot-toast";
import {
  useDeleteProductImageMutation,
  useGetProductDetailsQuery,
  useUploadImagesProductMutation,
} from "../../redux/api/ProductApi";
import { useNavigate, useParams } from "react-router-dom";

const UploadImages = () => {
  const params = useParams();
  //imgref silinen resimleri yükleme yerinden silmek için
  const FileInputRef = useRef(null);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreview, setimagePreview] = useState([]);
  const [uploadImages, setuploadImages] = useState([]);

  const [uploadImagesProduct, { isLoading, error, isSuccess }] =
    useUploadImagesProductMutation();
  const { data } = useGetProductDetailsQuery(params?.id);
  const [deleteProductImage, { isLoading: deleteLoading, error: DeleteError }] =
    useDeleteProductImageMutation();

  useEffect(() => {
    if (data?.product) {
      setuploadImages(data?.product?.images);
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if (DeleteError) {
      toast.error(DeleteError?.data?.message);
    }
    if (isSuccess) {
      setimagePreview([]);
      toast.success("Images Uploaded");
      navigate("/admin/products");
    }
  }, [error, isSuccess, data]);

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setimagePreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImagePreviewDelete = (image) => {
    const filteredImagePreview = imagePreview.filter((img) => img !== image);

    setImages(filteredImagePreview);
    setimagePreview(filteredImagePreview);
  };
  //silinen resimleri dosya yükleme yerinden silmek için
  const handleResetFileInput = () => {
    //dosya girişi var mı kontrol
    if (FileInputRef.current) {
      FileInputRef.current.value = "";
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    uploadImagesProduct({ id: params?.id, body: { images } });
  };

  //resim silme
  const deleteImage = (imgId) => {
    deleteProductImage({ id: params?.id, body: { imgId } });
  };

  return (
    <AdminLayout>
      <div className="row wrapper">
        <div className="col-10 col-lg-8 mt-5 mt-lg-0">
          <form
            onSubmit={submitHandler}
            className="shadow rounded bg-body"
            enctype="multipart/form-data"
          >
            <h2 className="mb-4">Upload Product Images</h2>

            <div className="mb-3">
              <label for="customFile" className="form-label">
                Choose Images
              </label>

              <div className="custom-file">
                <input
                  type="file"
                  name="product_images"
                  className="form-control"
                  id="customFile"
                  multiple
                  ref={FileInputRef}
                  onChange={onChange}
                  onClick={handleResetFileInput}
                />
              </div>
              {imagePreview?.length > 0 && (
                <div className="new-images my-4">
                  <p className="text-warning">New Images:</p>
                  <div className="row mt-4">
                    {imagePreview?.map((img) => (
                      <div className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={img}
                            alt="Card"
                            className="card-img-top p-2"
                            style={{ width: "100%", height: "80px" }}
                          />
                          <button
                            onClick={() => handleImagePreviewDelete(img)}
                            style={{
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                            }}
                            type="button"
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {uploadImages?.length > 0 && (
                <div className="uploaded-images my-4">
                  <p className="text-success">Product Uploaded Images:</p>
                  <div className="row mt-1">
                    {uploadImages?.map((img) => (
                      <div className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={img?.url}
                            alt="Card"
                            className="card-img-top p-2"
                            style={{ width: "100%", height: "80px" }}
                          />
                          <button
                            style={{
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                            }}
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            disabled={isLoading || deleteLoading}
                            type="button"
                            onClick={() => deleteImage(img?.public_id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading || deleteLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadImages;
