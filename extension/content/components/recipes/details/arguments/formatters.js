import React from "react";
import { Tag } from "rsuite";

export function multiColumnFormatter(fields = [], formatters = {}) {
  const columns = (key, value, data) => (
    <div className="d-flex w-100">
      {fields.map((field) => (
        <div key={field} className="flex-basis-0 flex-grow-1">
          {formatters[field](field, data[field], data)}
        </div>
      ))}
    </div>
  );
  return columns;
}

export function stringFormatter(key, value) {
  return (
    <div className="mt-4">
      <div className="d-flex align-items-center">
        <div className="pr-2 font-weight-bold">{key}</div>
      </div>
      <div className="my-1 text-subtle">{value}</div>
    </div>
  );
}

export function codeFormatter(key, value) {
  return stringFormatter(key, <code>{value}</code>);
}

export function tagFormatter(options = {}) {
  const { className, color } = options;
  return (key, value) => {
    return stringFormatter(
      key,
      <Tag className={className} color={color}>
        {value}
      </Tag>,
    );
  };
}

export function booleanFormatter(key, value) {
  const label = key.startsWith("is") ? `${key}?` : key;
  return (
    <div className="mt-4">
      <div className="d-flex align-items-center">
        <div className="pr-2 font-weight-bold">{label}</div>
      </div>
      <div className="my-1 text-subtle">
        <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
      </div>
    </div>
  );
}

export function tableFormatter(fields = [], formatters = {}) {
  const table = (key, values) => {
    return (
      <div className="mt-4">
        <div className="d-flex align-items-center">
          <div className="pr-2 font-weight-bold">{key}</div>
        </div>
        <div className="mt-3 mb-1 text-subtle">
          <table className="data-table w-100">
            <thead>
              <tr>
                {fields.map((field) => (
                  <th key={field}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {values.map((value, index) => (
                <tr key={index}>
                  {fields.map((field) => (
                    <td key={field}>
                      {formatters[field]
                        ? formatters[field](field, value[field])
                        : value[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return table;
}
