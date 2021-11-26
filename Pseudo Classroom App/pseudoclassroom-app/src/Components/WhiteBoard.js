import React,{useState,useEffect} from 'react'
import axios from 'axios';
import "../Css/TeacherDashboard.css"

/*
This component is for showing the white board to the  teachers to teach the students to teach in virtual classes.
Rendered from TeacherDashboard.js
*/

function WhiteBoard(props) {
    /*
    Show Pencils options like change color, change width and all such things
    */
    const [ShowPencilOptions,setShowPencilOptions]=useState(false);
    /*
    Show Eraser options like width to change
    */
    const [ShowEraserOptions,setShowEraserOptions]=useState(false);
    /*
    Check if canvas element is there or not important for drawing and handle error.
    */
    const [canvas,setCanvas]=useState(null);
    /*
    Store pencil width selected by user.
    */
    const [Pencilwidth,setPencilwidth]=useState(3);
    /*
    Check if pencil is selected or eraser
    */
    const [isPencil,setIsPencil]=useState(true);
    /*
    store Pencil color selected by user.
    */
    const [Pencilcolor,setPencilcolor]=useState("black");
    /*
    Store Eraser width selected by user.
    */
    const [EraserWidth,setEraserWidth]=useState(3);
    /*
    store the tool to draw any thing on canvas or to perform anything on canvas might be erasing also.
    */
    const [tool,setTool]=useState(null);
    /*
    hack for erasing --> we can do white color or background color over the area we want to erase.
    */
    let eraserColor='white';
    //store whther mouse on canvas or not.
    let mouseDown;
    /*
    Store the trackes drawn on canvas to handle undo and redo operations.
    */
    const [undoRedoTracker,setundoRedoTracker]=useState([]);
    /*
    Store the track index of current state of canvas to help in undo and redoing the tasks.
    */
    const [track,setTrack]=useState(0);

    //task to perform in first mounting of the component.
    useEffect(() => {
        //Setting the canvas element;
        setCanvas(document.querySelector(".board-canvas"));

        //If canvs element is setted now set tool over that canvas which means getting the context of canvas.
        if(canvas){
            canvas.width=1700;
            canvas.height=700;   
            setTool(canvas.getContext('2d'));
            /*
            If tool is setted change the pencil color, stroke or if eraser is selected 
            set its width to perform the further drawing. 
            */
            if(tool){
                tool.strokeStyle=!isPencil ? eraserColor : Pencilcolor;
                tool.lineWidth= !isPencil? EraserWidth : Pencilwidth;
            }

            /*
            if Something is there int undoRedoTracker in the first mounting of the component then draw that
            */
            if(undoRedoTracker.length){
                const url=undoRedoTracker[track];//get URL of current track
                let img = new Image(); // new image reference element created to draw that on canvas
                img.src = url;
                img.onload = (e) => {
                    tool.drawImage(img, 0, 0, canvas.width, canvas.height);//Draws image on canvs directly.
                }
            }
        }
    })

    /*
    Task to perform if tool is dwon on canvas which to begin the path to draw.
    */
    function CanvasMouseDown(e){
        if(tool){
                mouseDown = true;
                tool.beginPath();//Begin the  path on canvas
                tool.moveTo(e.clientX.offsetLeft-50, e.clientY.offsetTop-100);//move  to the next location pointed by user.
        }
    }
    /*
    Task to perform if tool is up on canvas which to Stop drawing and storing that current 
    canvas state in Tracker. and after that drawing the whole content on canvas
    */
    function CanvasMouseUp(e){
        mouseDown = false;    
        let url = canvas.toDataURL();//Create URL of current canvas state
        let newundoRedoTracker=undoRedoTracker;
        newundoRedoTracker.push(url);
        setundoRedoTracker(newundoRedoTracker);
        setTrack(undoRedoTracker.length-1);
        let img = new Image(); // new image reference element to draw that on canvas
        img.src = url;
        img.onload = (e) => {
            tool.drawImage(img, 0, 0, canvas.width, canvas.height);//Draws the image on canvas
        }
    }
    /*
    Task to perform if tool is moving on canvas which to keep drawing on the canvas. 
    */
    function CanvasMouseMove(e){
        if (mouseDown) {
            /*
            Store in place all data of current move on canvas. points at which current is been triggered (x,y),
            Color of pencil(if eraser it is white), width of stroke accoridng to pencil or eraser.
            */
            let data = {
                x: e.clientX-canvas.offsetLeft-50,
                y: e.clientY-canvas.offsetTop-100,
                color: !isPencil ? eraserColor : Pencilcolor,
                width: !isPencil? EraserWidth : Pencilwidth
            }
            //Draw line to this Point on the canvas
            tool.lineTo(data.x, data.y);
            //Set the Strokestyle/color
            tool.strokeStyle=data.color;
            //Set the width of stroke to draw
            tool.lineWidth=data.width;
            //Finally, draw the stroke.
            tool.stroke();
        }
    }
    
    return (
        <div className="whiteBoard">
             <div className="back-button" onClick={()=>props.setIsWhiteBoardbyProp()}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
             
            <div className="tools-cont scale-tools">
                {/* Show the Pencil options is Pencil image is clicked */}
                <img className="pencil" src="Pencil.svg" alt="Pencil" onClick={
              ()=>{
                  setShowPencilOptions(!ShowPencilOptions)
                  setIsPencil(true);
                }
              }/>
               {/* Show the eraser options is Eraser image is clicked */}
                <img className="eraser" src="Eraser.svg" alt="Eraser"  onClick={
              ()=>{
                  setShowEraserOptions(!ShowEraserOptions)
                  setIsPencil(false);
                  }
              }/>
                {/* download whatever is drawn on canvas using button*/}
                <img className="download" src="Download.svg" alt="Download" onClick={()=>{
                     let url = canvas.toDataURL();

                     let a = document.createElement("a");
                     a.href = url;
                     a.download = "board.jpg";
                     a.click();
                }}/>
                {/*Upload an image on canvas using this button*/}
                <img className="upload" src="Upload.svg" alt="Upload" onClick={()=>{
                    //create an input element to take input from desktop of any image to upload
                    let inputImage=document.createElement("input");
                    inputImage.type="file";
                    /*
                    Add a listener to the input element so that it can collect file to upload 
                    */
                    inputImage.addEventListener("change",(e)=>{
                        if(e.target.files){
                            const file=e.target.files[0];//take file 
                            var dataURL = new FileReader();//read the file and create URL
                            dataURL.readAsDataURL(file);
                            dataURL.onloadend = function (e) {
                                var myImage = new Image(); //Create image element referrence to draw image on canvas
                                myImage.src = e.target.result;
                                myImage.onload = function(ev) {
                                    tool.drawImage(myImage,0,0,canvas.width,canvas.height);
                                }
                            }
                        }
                    })
                    //now perform that listener so that it automatically start taking the input of file to upload. 
                    inputImage.click();
                }}/>

                <img className="reset" src="reset.svg" alt="reset" onClick={()=>{
                    if(tool)
                    tool.clearRect(0,0,canvas.width,canvas.height);
                    setundoRedoTracker([]); 
                }}/>
                 {/*Redo button redo the action drawn on canvas. */}   
                <img className="redo" src="Redo.svg" alt="Redo" onClick={()=>{
                      //check whether we have something in undoRedoTracker to draw back on canvas.
                      if (track < undoRedoTracker.length-1) setTrack(track+1);//if yes then increase the track index 
                      let url;
                      if(track<undoRedoTracker.length-1)
                      url = undoRedoTracker[track+1];//get the url
                      else{
                          return;
                      }
                      
                      let img = new Image(); // new image reference element
                      img.src = url;
                      img.onload = (e) => {
                          tool.drawImage(img, 0, 0, canvas.width, canvas.height);//Draw image on canvas.
                      }
                }}/>
                {/* Undo button to perform undo action drawn on canvas */}
                <img className="undo" src="Undo.svg" alt="Undo" onClick={()=>{
                    //check whether we have something in undoRedoTracker to draw back on canvas.
                    /*
                    decrease the track as we have to perform undo operations it doesn't
                     mean we delete current track value in undoRedotracker
                     */
                    if (track > 0) setTrack(track-1);
                    let url;
                    if(track>0)
                    url = undoRedoTracker[track-1];//get  the url to draw now on canvas
                    else{
                        tool.clearRect(0,0,canvas.width,canvas.height);
                        return;
                    }
                    
                    let img = new Image(); // new image reference element
                    img.src = url;
                    img.onload = (e) => {
                        tool.drawImage(img, 0, 0, canvas.width, canvas.height);//Draw image on canvas.
                    }
                }} />

            </div>
            {
                /*
                 if asked to show pencil options then show it
                */
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
                /*
                if asked to show eraser options then show it.
                */
                ShowEraserOptions&&
            <div className="eraser-tool-cont">
                <input type="range" min="2" max="20" value={EraserWidth} className="eraser-width" onChange={(e)=>{
                    setIsPencil(false);
                    setEraserWidth(e.target.value)
                    }}/>
            </div>
            }
            {/*Canvas element on which drawing is performed */}
            <canvas className="board-canvas" onMouseDown={CanvasMouseDown } onMouseUp={CanvasMouseUp} onMouseMove={CanvasMouseMove}></canvas> 
        </div>
    )
}

export default WhiteBoard
