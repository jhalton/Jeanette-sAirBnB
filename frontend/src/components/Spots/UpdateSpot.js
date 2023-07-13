/*
User Stories
As an authenticated user, I want to update a spot I created.
NOTE:
The image update on a spot is not required for MVP.

Acceptance Criteria
✓Clicking "Update" on one of the spot tiles on the spot management
    page navigates the user to the update spot form which looks like 
    the same as the create a new spot form, but pre-populated with the 
    values stored in the database for the spot that was clicked, the 
    title changed to "Update your Spot", and with a submit button text 
    of "Update your Spot". Image URL inputs on the update spot form are 
    optional for MVP.
✓When the update form submission is successful, the user is navigated 
    to the updated spot's details page.
✓The updated spot's detail page should display the updated information. No refresh should be necessary.
*/

import { useDispatch, useSelector } from "react-redux";
import { updateSpot } from "../../store/sessionUserSpots";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./Spots.css";

const UpdateSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.singleSpot[spotId]);

  console.log("LOOK HERE UPDATE SPOT.ID", spot);

  const [country, setCountry] = useState(spot.country);
  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state, setState] = useState(spot.state);
  //   const [lat, setLat] = useState("");
  //   const [lng, setLng] = useState("");
  const [description, setDescription] = useState(spot.description);
  const [name, setName] = useState(spot.name);
  const [price, setPrice] = useState(spot.price);
  const [previewImage, setPreviewImage] = useState(
    spot.previewImage ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmhPnAShm7aN-oG4DPzlFYcN4EGNnNVjtyiQ&usqp=CAU"
  );
  const [otherImages, setOtherImages] = useState(spot.otherImages);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

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
        otherImages,
      };
      dispatch(updateSpot(spotId, newSpot)).then(
        history.push(`/api/spots/${spot.id}`)
      );

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
      setOtherImages("");
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
      <h2 className="create-spot-form-header">Update your Spot</h2>
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <h3>Where's your place located?</h3>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          //   required
        />
        <div>{errors.country && `* ${errors.country}`}</div>
        <input
          type="text"
          placeholder="Street address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          //   required
        />
        <div>{errors.address && `* ${errors.address}`}</div>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          //   required
        />
        <div>{errors.city && `* ${errors.city}`}</div>
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          //   required
        />
        <div>{errors.state && `* ${errors.state}`}</div>
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
          type="text"
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          //   required
        />
        <div>{errors.description && `* ${errors.description}`}</div>
        <h3>Create a title for your spot</h3>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <input
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          //   required
        />
        <div>{errors.name && `* ${errors.name}`}</div>
        <h3>Set a base price</h3>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        <input
          type="number"
          placeholder="Price per night (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          //   required
        />
        <div>{errors.price && `* ${errors.price}`}</div>
        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <input
          type="text"
          placeholder="Preview image URL"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          //   required
        />
        <div>{errors.previewImage && `* ${errors.previewImage}`}</div>
        <input
          type="text"
          placeholder="Image URL"
          value={otherImages}
          onChange={(e) => setOtherImages(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={otherImages}
          onChange={(e) => setOtherImages(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={otherImages}
          onChange={(e) => setOtherImages(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={otherImages}
          onChange={(e) => setOtherImages(e.target.value)}
        />
        <button
          className="create-spot-form-button"
          type="submit"
          disabled={Object.keys(errors).length ? true : false}
        >
          Update your Spot
        </button>
      </form>
    </div>
  );
};

export default UpdateSpot;
