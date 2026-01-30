import { useState } from "react";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [saveDir, setSaveDir] = useState(null);

  // Upload folder
  const handleFolderUpload = (e)=>{
    const files = Array.from(e.target.files)
      .filter(f=>f.type.startsWith("image/"));
    setPhotos(files);
    setCurrentIndex(0);
  };

  // Choose save folder
  const chooseSaveFolder = async ()=>{
    const dir = await window.showDirectoryPicker();
    setSaveDir(dir);
    alert("Save folder selected!");
  };

  // Save file
  const saveFile = async (file)=>{
    if(!saveDir) return;

    const newFile = await saveDir.getFileHandle(file.name,{create:true});
    const writable = await newFile.createWritable();
    await writable.write(file);
    await writable.close();
  };

  const handleYes = async ()=>{
    const file = photos[currentIndex];
    setMatches([...matches,file]);
    if(saveDir) await saveFile(file);
    next();
  };

  const handleNo = ()=> next();

  const next = ()=>{
    if(currentIndex<photos.length-1)
      setCurrentIndex(currentIndex+1);
    else alert("Review Complete!");
  };

  return(
    <div style={{
      minHeight:"100vh",
      fontFamily:"Poppins, sans-serif",
      background:"linear-gradient(135deg,#667eea,#764ba2)",
      padding:30,
      color:"white",
      textAlign:"center"
    }}>

      <h1 style={{fontSize:40}}>🔍 FindMe</h1>

      <div style={{
        background:"white",
        color:"black",
        padding:25,
        borderRadius:20,
        width:"90%",
        maxWidth:600,
        margin:"auto",
        boxShadow:"0 10px 25px rgba(0,0,0,0.3)"
      }}>

        <h3>📂 Upload Photo Folder</h3>
        <input type="file" webkitdirectory="true" multiple
          onChange={handleFolderUpload}/>

        <h3>💾 Choose Save Folder</h3>
        <button onClick={chooseSaveFolder}
          style={btnBlue}>
          Select Folder
        </button>

        {photos.length>0 && currentIndex<photos.length &&(
          <>
          <h2>Is this a match?</h2>

          <img src={URL.createObjectURL(photos[currentIndex])}
            width="320" style={imgStyle}/>

          <div>
            <button onClick={handleYes} style={btnGreen}>✅ YES</button>
            <button onClick={handleNo} style={btnRed}>❌ NO</button>
          </div>

          <p>{currentIndex+1}/{photos.length}</p>
          </>
        )}

        {matches.length>0 &&(
          <>
          <h2>⭐ Matched Photos</h2>
          <div style={{
            display:"flex",
            flexWrap:"wrap",
            justifyContent:"center"
          }}>
            {matches.map((m,i)=>(
              <img key={i}
                src={URL.createObjectURL(m)}
                width="80"
                style={{margin:5,borderRadius:10}}
              />
            ))}
          </div>
          </>
        )}

      </div>
    </div>
  );
}

const imgStyle={
  borderRadius:15,
  margin:15,
  boxShadow:"0 5px 15px rgba(0,0,0,0.2)"
};

const btnGreen={
  background:"#4CAF50",
  color:"white",
  padding:"12px 25px",
  border:"none",
  borderRadius:10,
  margin:10,
  fontSize:16
};

const btnRed={
  background:"#f44336",
  color:"white",
  padding:"12px 25px",
  border:"none",
  borderRadius:10,
  margin:10,
  fontSize:16
};

const btnBlue={
  background:"#2196F3",
  color:"white",
  padding:"10px 20px",
  border:"none",
  borderRadius:8,
  cursor:"pointer"
};
