import React, { useState, useEffect, useRef } from "react";
import { createPopper } from "@popperjs/core";
import { grey } from "./colors";
import ArrowUpIcon from "./img/ArrowUp";
import ArrowDownIcon from "./img/ArrowDown";
import ArrowLeftIcon from "./img/ArrowLeft";
import ArrowRightIcon from "./img/ArrowRight";
import TrashIcon from "./img/Trash";
import TextIcon from "./Text";
import MultiIcon from "./img/Multi";
import HashIcon from "./img/Hash";
import PlusIcon from "./img/Plus";
import { shortId } from "./utils";

export default function Header({
  column: { id, created, label, dataType, getResizerProps, getHeaderProps },
  setSortBy,
  dataDispatch
}) {
  const [expanded, setExpanded] = useState(created || false);
  const [header, setHeader] = useState(label);
  const [showType, setShowType] = useState(false);
  const buttons = [
    {
      onClick: (e) => {
        dataDispatch({ type: "update_column_header", columnId: id, label: header });
        setSortBy([{ id: id, desc: false }]);
        setExpanded(false);
      },
      icon: <ArrowUpIcon />,
      label: "Sort ascending"
    },
    {
      onClick: (e) => {
        dataDispatch({ type: "update_column_header", columnId: id, label: header });
        setSortBy([{ id: id, desc: true }]);
        setExpanded(false);
      },
      icon: <ArrowDownIcon />,
      label: "Sort descending"
    },
    {
      onClick: (e) => {
        dataDispatch({ type: "update_column_header", columnId: id, label: header });
        dataDispatch({ type: "add_column_to_left", columnId: id, focus: false });
        setExpanded(false);
      },
      icon: <ArrowLeftIcon />,
      label: "Insert left"
    },
    {
      onClick: (e) => {
        dataDispatch({ type: "update_column_header", columnId: id, label: header });
        dataDispatch({ type: "add_column_to_right", columnId: id, focus: false });
        setExpanded(false);
      },
      icon: <ArrowRightIcon />,
      label: "Insert right"
    },
    {
      onClick: (e) => {
        dataDispatch({ type: "update_column_header", columnId: id, label: header });
        dataDispatch({ type: "delete_column", columnId: id });
        setExpanded(false);
      },
      icon: <TrashIcon />,
      label: "Delete"
    }
  ];

  let propertyIcon;
  switch (dataType) {
    case "number":
      propertyIcon = <HashIcon />;
      break;
    case "text":
      propertyIcon = <TextIcon />;
      break;
    case "select":
      propertyIcon = <MultiIcon />;
      break;
    default:
      break;
  }

  useEffect(() => {
    if (created) {
      setExpanded(true);
    }
  }, [created]);

  useEffect(() => {
    setHeader(label);
  }, [label]);

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      dataDispatch({ type: "update_column_header", columnId: id, label: header });
      setExpanded(false);
    }
  }

  function handleChange(e) {
    setHeader(e.target.value);
  }

  function handleBlur(e) {
    e.preventDefault();
    dataDispatch({ type: "update_column_header", columnId: id, label: header });
  }

  // Manually create popper instance
  const popperInstanceRef = useRef(null);
  const referenceElementRef = useRef(null);
  const popperElementRef = useRef(null);

  useEffect(() => {
    if (referenceElementRef.current && popperElementRef.current) {
      popperInstanceRef.current = createPopper(referenceElementRef.current, popperElementRef.current, {
        placement: "bottom",
        strategy: "absolute"
      });
    }
    return () => {
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = null;
      }
    };
  }, []);

  return id !== 999999 ? (
    <>
      <div {...getHeaderProps({ style: { display: "inline-block" } })} className="th noselect">
        <div className="th-content" onClick={() => setExpanded(true)} ref={referenceElementRef}>
          <span className="svg-icon svg-gray icon-margin">{propertyIcon}</span>
          {label}
        </div>
        <div {...getResizerProps()} className="resizer" />
      </div>
      {expanded && <div className="overlay" onClick={() => setExpanded(false)} />}
      {expanded && (
        <div ref={popperElementRef} style={{ zIndex: 3 }} className="popper-element">
          <div className="bg-white shadow-5 border-radius-md" style={{ width: 240, position: "absolute" }}>
            <div style={{ paddingTop: "0.75rem", paddingLeft: "0.75rem", paddingRight: "0.75rem"}}>
              <div className="is-fullwidth" style={{ marginBottom: 12 }}>
                <input
                  className="form-input"
                  type="text"
                  value={header}
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <span className="font-weight-600 font-size-75" style={{ textTransform: "uppercase", color: grey(500) }}>
                Property Type
              </span>
            </div>
            <div style={{ padding: "4px 0px" }}>
              <button
                className="sort-button"
                type="button"
                // onMouseEnter={() => setShowType(true)}
                // onMouseLeave={() => setShowType(false)}
              >
                <span className="svg-icon svg-text icon-margin">{propertyIcon}</span>
                <span style={{ textTransform: "capitalize" }}>{dataType}</span>
              </button>
              {showType && (
                <div
                  className="shadow-5 bg-white border-radius-m"
                  onMouseEnter={() => setShowType(true)}
                  onMouseLeave={() => setShowType(false)}
                  style={{
                    width: 200,
                    backgroundColor: "white",
                    zIndex: 4,
                    padding: "4px 0px"
                  }}
                >
                  {buttons.map((button) => (
                    <button key={shortId()} className="sort-button" onMouseDown={button.onClick}>
                      <span className="svg-icon svg-text icon-margin">{button.icon}</span>
                      {button.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ borderTop: `2px solid ${grey(200)}`, padding: "4px 0px" }}>
              {buttons.map((button) => (
                <button key={shortId()} type="button" className="sort-button" onMouseDown={button.onClick}>
                  <span className="svg-icon svg-text icon-margin">{button.icon}</span>
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div {...getHeaderProps({ style: { display: "inline-block" } })} className="th noselect">
      <div
        className="th-content"
        style={{ display: "flex", justifyContent: "center" }}
        onClick={(e) => dataDispatch({ type: "add_column_to_left", columnId: 999999, focus: true })}
      >
        <span className="svg-icon-sm svg-gray">
          <PlusIcon />
        </span>
      </div>
    </div>
  );
}
