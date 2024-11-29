'use client';

export const checkAuth = () => {
    if(typeof window !== 'undefined'){
        const token = sessionStorage.getItem("admintoken");
        if (!token) {
          return false;
        }
    }
    return true;
  };