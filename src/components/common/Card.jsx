import React from "react";
import classNames from "classnames";

/**
 * Card component for displaying content in a contained box
 */
const Card = ({
  children,
  className = "",
  padding = "normal",
  hover = false,
  onClick = null,
  ...props
}) => {
  const paddingClasses = {
    none: "",
    small: "p-3",
    normal: "p-5",
    large: "p-6",
  };

  const cardClasses = classNames(
    "bg-white rounded-lg shadow-sm border border-gray-200",
    paddingClasses[padding],
    hover && "transition-all duration-200 hover:shadow-md",
    onClick && "cursor-pointer",
    className
  );

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Header component for card titles and actions
 */
Card.Header = ({ children, className = "", ...props }) => {
  const headerClasses = classNames(
    "flex items-center justify-between mb-4 pb-2 border-b border-gray-100",
    className
  );

  return (
    <div className={headerClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Title component for card titles
 */
Card.Title = ({ children, className = "", ...props }) => {
  const titleClasses = classNames(
    "text-lg font-semibold text-gray-800",
    className
  );

  return (
    <h3 className={titleClasses} {...props}>
      {children}
    </h3>
  );
};

/**
 * Card.Body component for card content
 */
Card.Body = ({ children, className = "", ...props }) => {
  const bodyClasses = classNames(className);

  return (
    <div className={bodyClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Footer component for card actions
 */
Card.Footer = ({ children, className = "", ...props }) => {
  const footerClasses = classNames(
    "mt-4 pt-3 border-t border-gray-100",
    className
  );

  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
