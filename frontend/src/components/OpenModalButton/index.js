import { useModal } from "../../context/Modal";

const OpenModalButton = ({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
  className,
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose();
    setModalContent(modalComponent);
  };

  return (
    <div>
      <button className={className} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default OpenModalButton;
