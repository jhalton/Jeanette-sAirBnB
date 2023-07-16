import { useDispatch } from "react-redux";
import { createSpot } from "../../store/sessionUserSpots";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Spots.css";
import { createPreviewImage, createAdditionalImage } from "../../store/images";

const CreateNewSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  //   const [lat, setLat] = useState("");
  //   const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const additionalImgArr = [image1, image2, image3, image4];
  const filteredImgArr = additionalImgArr.filter((img) => img.length > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!Object.keys(errors).length) {
      const newSpot = {
        country,
        address,
        city,
        state,
        // lat,
        // lng,
        description,
        name,
        price,
        previewImage,
        image1,
        image2,
        image3,
        image4,
      };
      dispatch(createSpot(newSpot)).then((createdSpot) => {
        dispatch(createPreviewImage(createdSpot.id, previewImage));
        filteredImgArr.forEach((image) => {
          dispatch(createAdditionalImage(createdSpot.id, image));
        });
        history.push(`/api/spots/${createdSpot.id}`);
      });

      //reset form inputs and errors
      setCountry("");
      setAddress("");
      setCity("");
      setState("");
      //   setLat("");
      //   setLng("");
      setDescription("");
      setName("");
      setPrice("");
      setPreviewImage("");
      setImage1("");
      setImage2("");
      setImage3("");
      setImage4("");
      setErrors({});
    }
  };

  //Check for errors in real time. Display them until they are resolved.
  useEffect(() => {
    const validationErrors = {};

    //validation errors for form
    if (description.length < 30)
      validationErrors["description"] =
        "Description needs 30 or more characters.";
    if (!country) validationErrors["country"] = "Country is required";
    if (!address) validationErrors["address"] = "Street address is required";
    if (!city) validationErrors["city"] = "City is required";
    if (!state) validationErrors["state"] = "State is required";
    if (!description)
      validationErrors["description"] = "Description is required";
    if (!name) validationErrors["name"] = "Title of your spot is required";
    if (!price) validationErrors["price"] = "Base price is required";
    if (!previewImage)
      validationErrors["previewImage"] = "Preview image is required";

    setErrors(validationErrors);
  }, [country, address, city, state, description, name, price, previewImage]);

  return (
    <div className="create-spot-form-div">
      <h2 className="create-spot-form-header">Create New Spot</h2>
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <h3>Where's your place located?</h3>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <input
          className="create-country"
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          //   required
        />
        <div>{isSubmitted && errors.country && `* ${errors.country}`}</div>
        <input
          className="create-address"
          type="text"
          placeholder="Street address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          //   required
        />
        <div>{isSubmitted && errors.address && `* ${errors.address}`}</div>
        <div className="city-and-state">
          <input
            className="create-city"
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            //   required
          />
          <input
            className="create-state"
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            //   required
          />
        </div>
        <div>{isSubmitted && errors.city && `* ${errors.city}`}</div>
        <div>{isSubmitted && errors.state && `* ${errors.state}`}</div>
        {/* <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        /> */}
        <h3>Describe your place to your guests</h3>
        <p>
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <textarea
          className="create-description"
          type="text"
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          //   required
        />
        <div>
          {isSubmitted && errors.description && `* ${errors.description}`}
        </div>
        <h3>Create a title for your spot</h3>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <input
          className="create-name"
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          //   required
        />
        <div>{isSubmitted && errors.name && `* ${errors.name}`}</div>
        <h3>Set a base price</h3>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        <input
          className="create-price"
          type="number"
          placeholder="Price per night (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          //   required
        />
        <div>{isSubmitted && errors.price && `* ${errors.price}`}</div>
        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <input
          type="text"
          placeholder="Preview image URL"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          //   required
        />
        <div>
          {isSubmitted && errors.previewImage && `* ${errors.previewImage}`}
        </div>
        <input
          type="text"
          placeholder="Image URL"
          value={image1}
          onChange={(e) => setImage1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image2}
          onChange={(e) => setImage2(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image3}
          onChange={(e) => setImage3(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image4}
          onChange={(e) => setImage4(e.target.value)}
        />
        <button
          className="create-spot-form-button"
          type="submit"
          // disabled={Object.keys(errors).length ? true : false}
        >
          Create Spot
        </button>
      </form>
    </div>
  );
};

export default CreateNewSpot;
