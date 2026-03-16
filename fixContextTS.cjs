const fs = require('fs');
let file = 'src/context/NotificationContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';", "import { createContext, useContext, useState, useEffect } from 'react';\nimport type { ReactNode } from 'react';");

fs.writeFileSync(file, content);
console.log("TS fixed");
