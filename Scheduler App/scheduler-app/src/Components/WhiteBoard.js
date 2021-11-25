import React,{useState,useEffect} from 'react'
import axios from 'axios';
import "../Css/TeacherDashboard.css"

function WhiteBoard(props) {
    const [ShowPencilOptions,setShowPencilOptions]=useState(false);
    const [ShowEraserOptions,setShowEraserOptions]=useState(false);
    const [canvas,setCanvas]=useState(null);
    const [Pencilwidth,setPencilwidth]=useState(3);
    const [isPencil,setIsPencil]=useState(true);
    const [Pencilcolor,setPencilcolor]=useState("blackx");
    const [EraserWidth,setEraserWidth]=useState(3);
    const [tool,setTool]=useState(null);
    let eraserColor='white';
    let mouseDown;
    const [undoRedoTracker,setundoRedoTracker]=useState([]);
    const [track,setTrack]=useState(0);

    useEffect(() => {
        setCanvas(document.querySelector(".board-canvas"));
        

        if(canvas){
            canvas.width=1700;
            canvas.height=700;   
            setTool(canvas.getContext('2d'));
            if(tool){
                tool.strokeStyle=!isPencil ? eraserColor : Pencilcolor;
                tool.lineWidth= !isPencil? EraserWidth : Pencilwidth;
            }
            if(undoRedoTracker.length){
                const url=undoRedoTracker[track];
                let img = new Image(); // new image reference element
                img.src = url;
                img.onload = (e) => {
                    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            }else{
                // axios.get("http://localhost:4000/course/"+props.Course._id)
                // .then((res)=>{
                //     if(res.data){
                //         const  prevUndoRedotracker=res.data.WhiteBoardData;
                //         if(prevUndoRedotracker.length){
                //             let url=prevUndoRedotracker[prevUndoRedotracker.length-1];
                //             let img = new Image(); // new image reference element
                //             img.src = url;
                //             img.onload = (e) => {
                //                 tool.drawImage(img, 0, 0, canvas.width, canvas.height);
                //             }
                //         }       
                //     }
                // })
            }
        }
        console.log(tool);
    })

    function CanvasMouseDown(e){
        if(tool){
                mouseDown = true;
                tool.beginPath();
                tool.moveTo(e.clientX.offsetLeft-50, e.clientY.offsetTop-100);
                console.log(e.clientY,e.clientX,"down");
        }
    }
    function CanvasMouseUp(e){
        mouseDown = false;
        
        let url = canvas.toDataURL();
        let newundoRedoTracker=undoRedoTracker;
        newundoRedoTracker.push(url);
        console.log(url);
        setundoRedoTracker(newundoRedoTracker);
        setTrack(undoRedoTracker.length-1);
        let img = new Image(); // new image reference element
        img.src = url;
        img.onload = (e) => {
            tool.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        console.log("up");
        console.log(undoRedoTracker)
        // axios.patch("http://localhost:4000/course/"+props.Course._id,{"WhiteBoardData":undoRedoTracker})
        // .then((res)=>console.log(res))
        // .catch((err)=>console.log(err))
    } 
    function CanvasMouseMove(e){
        // console.log(mouseDown);
        if (mouseDown) {
            console.log(e.clientX,e.clientY)
            let data = {
                x: e.clientX-canvas.offsetLeft-50,
                y: e.clientY-canvas.offsetTop-100,
                color: !isPencil ? eraserColor : Pencilcolor,
                width: !isPencil? EraserWidth : Pencilwidth
            }
            console.log(data);
            tool.lineTo(data.x, data.y);
            tool.strokeStyle=data.color;
            tool.lineWidth=data.width;
            tool.stroke();
            console.log("move");
        }
    }
    
    return (
        <div className="whiteBoard">
             <div className="back-button" onClick={()=>props.setIsWhiteBoardbyProp()}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
             
            <div className="tools-cont scale-tools">
                <img className="pencil" src="Pencil.svg" alt="Pencil" onClick={
              ()=>{
                  setShowPencilOptions(!ShowPencilOptions)
                  setIsPencil(true);
                }
              }/>
                <img className="eraser" src="Eraser.svg" alt="Eraser"  onClick={
              ()=>{
                  setShowEraserOptions(!ShowEraserOptions)
                  setIsPencil(false);
                  }
              }/>

                <img className="download" src="Download.svg" alt="Download" onClick={()=>{
                     let url = canvas.toDataURL();

                     let a = document.createElement("a");
                     a.href = url;
                     a.download = "board.jpg";
                     a.click();
                }}/>

                <img className="upload" src="Upload.svg" alt="Upload" onClick={()=>{
                    let inputImage=document.createElement("input");
                    inputImage.type="file";
                    inputImage.addEventListener("change",(e)=>{
                        if(e.target.files){
                            const file=e.target.files[0];
                            var dataURL = new FileReader();
                            dataURL.readAsDataURL(file);
                            dataURL.onloadend = function (e) {
                                var myImage = new Image(); 
                                myImage.src = e.target.result;
                                myImage.onload = function(ev) {
                                    tool.drawImage(myImage,0,0,canvas.width,canvas.height);
                                }
                            }
                        }
                    })
                    inputImage.click();
                }}/>

                <img className="reset" src="reset.svg" alt="reset" onClick={()=>{
                    if(tool)
                    tool.clearRect(0,0,canvas.width,canvas.height);
                    setundoRedoTracker([]); 
                }}/>

                <img className="redo" src="Redo.svg" alt="Redo" onClick={()=>{
                      if (track < undoRedoTracker.length-1) setTrack(track+1);
                      let url;
                      if(track<undoRedoTracker.length-1)
                      url = undoRedoTracker[track+1];
                      else{
                          return;
                      }
                      
                      console.log(track,url);
                      let img = new Image(); // new image reference element
                      img.src = url;
                      img.onload = (e) => {
                          tool.drawImage(img, 0, 0, canvas.width, canvas.height);
                      }
                }}/>

                <img className="undo" src="Undo.svg" alt="Undo" onClick={()=>{
                    if (track > 0) setTrack(track-1);
                    let url;
                    if(track>0)
                    url = undoRedoTracker[track-1];
                    else{
                        tool.clearRect(0,0,canvas.width,canvas.height);
                        return;
                    }
                    
                    console.log(track,url);
                    let img = new Image(); // new image reference element
                    img.src = url;
                    img.onload = (e) => {
                        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
                    }
                }} />

            </div>
            {
                ShowPencilOptions&&
            <div className="pencil-tool-cont" >
            
                <div className="pencil-width-cont">
                    <input type="range" min="2" max="10" value={Pencilwidth} className="pencil-width" onChange={(e)=>{
                        setIsPencil(true);
                        setPencilwidth(e.target.value)}}/>
                </div>
                <div className="pencil-color-cont">
                    <input type="color" className="pencil-color" onChange={(e)=>{
                        setIsPencil(true);
                        setPencilcolor(e.target.value);
                    }} value={Pencilcolor}/>
                    
                </div>
            </div>
            }
            {
                ShowEraserOptions&&
            <div className="eraser-tool-cont">
                <input type="range" min="2" max="20" value={EraserWidth} className="eraser-width" onChange={(e)=>{
                    setIsPencil(false);
                    setEraserWidth(e.target.value)
                    }}/>
            </div>
            }
            {console.log(canvas)}
            <canvas className="board-canvas" onMouseDown={CanvasMouseDown } onMouseUp={CanvasMouseUp} onMouseMove={CanvasMouseMove}></canvas> 
        </div>
    )
}

export default WhiteBoard
