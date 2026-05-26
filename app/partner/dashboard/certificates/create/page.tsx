'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Rect, Circle as KonvaCircle, Star, Transformer, Line } from 'react-konva';
import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';
import {
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  GripVertical,
  LayoutTemplate,
  Layers,
  Palette,
  MousePointer2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Copy,
  ArrowUpToLine,
  ArrowDownToLine,
  Triangle,
  Star as StarIcon
} from 'lucide-react';

// ==========================================
// TYPES & INTERFACES
// ==========================================
type ElementType = 'text' | 'image' | 'shape';
type ShapeType = 'rect' | 'circle' | 'triangle' | 'star';
type TextAlign = 'left' | 'center' | 'right';

interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  name?: string;
}

interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: 'normal' | 'italic' | 'bold' | 'italic bold';
  align: TextAlign;
  fill: string;
}

interface ImageElement extends BaseElement {
  type: 'image';
  width: number;
  height: number;
  imageSrc: string;
}

interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

type CanvasElement = TextElement | ImageElement | ShapeElement;

interface Guideline {
  x?: number;
  y?: number;
  points: number[];
  orientation: 'horizontal' | 'vertical';
}

// ==========================================
// CONSTANTS & DEFAULTS
// ==========================================
const CANVAS_WIDTH = 1056; // Standard 11" x 8.5" at 96 DPI
const CANVAS_HEIGHT = 816;
const SNAP_THRESHOLD = 10;

const FONTS = [
  'Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Verdana, sans-serif',
  'Impact, sans-serif',
  'Courier New, monospace',
  'Trebuchet MS, sans-serif',
  'Palatino, serif',
  'Garamond, serif',
  'Bookman, serif',
];

const DEFAULT_TEMPLATES: Record<string, CanvasElement[]> = {
  classic: [
    { id: 't1', type: 'shape', shapeType: 'rect', x: 20, y: 20, width: CANVAS_WIDTH - 40, height: CANVAS_HEIGHT - 40, fill: 'transparent', stroke: '#c5a059', strokeWidth: 10, rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: true, name: 'Border Outer' },
    { id: 't2', type: 'shape', shapeType: 'rect', x: 35, y: 35, width: CANVAS_WIDTH - 70, height: CANVAS_HEIGHT - 70, fill: 'transparent', stroke: '#c5a059', strokeWidth: 2, rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: true, name: 'Border Inner' },
    { id: 't3', type: 'text', content: 'CERTIFICATE OF COMPLETION', x: 0, y: 150, fontSize: 48, fontFamily: 'Georgia, serif', fontStyle: 'bold', align: 'center', fill: '#1a1a1a', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Title' },
    { id: 't4', type: 'text', content: 'THIS IS PROUDLY PRESENTED TO', x: 0, y: 250, fontSize: 18, fontFamily: 'Arial, sans-serif', fontStyle: 'normal', align: 'center', fill: '#666666', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Subtitle' },
    { id: 't5', type: 'text', content: 'Eleanor Shellstrop', x: 0, y: 320, fontSize: 72, fontFamily: 'Georgia, serif', fontStyle: 'italic', align: 'center', fill: '#c5a059', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Recipient' },
    { id: 't6', type: 'text', content: 'For successfully completing the comprehensive training program.', x: 0, y: 440, fontSize: 20, fontFamily: 'Arial, sans-serif', fontStyle: 'normal', align: 'center', fill: '#333333', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Description' },
    { id: 't7', type: 'text', content: 'Date', x: 250, y: 620, fontSize: 18, fontFamily: 'Arial, sans-serif', fontStyle: 'normal', align: 'center', fill: '#666666', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Date Label' },
    { id: 't8', type: 'text', content: 'Signature', x: 750, y: 620, fontSize: 18, fontFamily: 'Arial, sans-serif', fontStyle: 'normal', align: 'center', fill: '#666666', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Sig Label' },
    { id: 't9', type: 'shape', shapeType: 'rect', x: 180, y: 600, width: 200, height: 2, fill: '#333333', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Date Line' },
    { id: 't10', type: 'shape', shapeType: 'rect', x: 680, y: 600, width: 200, height: 2, fill: '#333333', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Sig Line' },
  ],
  modern: [
    { id: 'm1', type: 'shape', shapeType: 'rect', x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT, fill: '#111827', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: true, name: 'Dark Background' },
    { id: 'm2', type: 'shape', shapeType: 'circle', x: -100, y: -100, width: 600, height: 600, fill: '#3b82f6', rotation: 0, scaleX: 1, scaleY: 1, opacity: 0.1, visible: true, locked: true, name: 'Deco Circle 1' },
    { id: 'm3', type: 'shape', shapeType: 'circle', x: CANVAS_WIDTH - 200, y: CANVAS_HEIGHT - 200, width: 500, height: 500, fill: '#8b5cf6', rotation: 0, scaleX: 1, scaleY: 1, opacity: 0.15, visible: true, locked: true, name: 'Deco Circle 2' },
    { id: 'm4', type: 'text', content: 'CERTIFICATE', x: 100, y: 150, fontSize: 64, fontFamily: 'Impact, sans-serif', fontStyle: 'normal', align: 'left', fill: '#ffffff', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Title' },
    { id: 'm5', type: 'text', content: 'OF ACHIEVEMENT', x: 100, y: 220, fontSize: 32, fontFamily: 'Arial, sans-serif', fontStyle: 'bold', align: 'left', fill: '#3b82f6', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Subtitle' },
    { id: 'm6', type: 'text', content: 'Awarded to', x: 100, y: 350, fontSize: 20, fontFamily: 'Arial, sans-serif', fontStyle: 'normal', align: 'left', fill: '#9ca3af', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Awarded To' },
    { id: 'm7', type: 'text', content: 'John Doe', x: 100, y: 400, fontSize: 56, fontFamily: 'Georgia, serif', fontStyle: 'normal', align: 'left', fill: '#ffffff', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Name' },
    { id: 'm8', type: 'shape', shapeType: 'rect', x: 100, y: 500, width: CANVAS_WIDTH - 200, height: 1, fill: '#374151', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Divider' },
    { id: 'm9', type: 'text', content: '2026', x: 100, y: 550, fontSize: 24, fontFamily: 'Arial, sans-serif', fontStyle: 'bold', align: 'left', fill: '#8b5cf6', rotation: 0, scaleX: 1, scaleY: 1, opacity: 1, visible: true, locked: false, name: 'Year' },
  ]
};

// ==========================================
// HELPERS
// ==========================================
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const getCenterCoordinates = (node: Konva.Node) => {
  const box = node.getClientRect();
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
    width: box.width,
    height: box.height,
  };
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function CertificateDesigner() {
  // --- Core State ---
  const [elements, setElements] = useState<CanvasElement[]>(deepClone(DEFAULT_TEMPLATES.classic));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [canvasSize, setCanvasSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  
  // --- UI State ---
  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'elements' | 'uploads' | 'background' | 'layers'>('templates');
  const [zoom, setZoom] = useState(1);
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [copiedElements, setCopiedElements] = useState<CanvasElement[]>([]);
  
  // --- History State ---
  const [history, setHistory] = useState<{ elements: CanvasElement[], bg: string }[]>([{ elements: deepClone(DEFAULT_TEMPLATES.classic), bg: '#ffffff' }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // --- Refs ---
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // ==========================================
  // HISTORY MANAGEMENT
  // ==========================================
  const pushToHistory = useCallback((newElements: CanvasElement[], newBg: string = backgroundColor) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ elements: deepClone(newElements), bg: newBg });
    // Limit history to 50 states
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, backgroundColor]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setElements(deepClone(prev.elements));
      setBackgroundColor(prev.bg);
      setHistoryIndex(historyIndex - 1);
      setSelectedIds([]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setElements(deepClone(next.elements));
      setBackgroundColor(next.bg);
      setHistoryIndex(historyIndex + 1);
      setSelectedIds([]);
    }
  }, [history, historyIndex]);

  // ==========================================
  // SHORTCUTS & EVENTS
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) redo();
        else undo();
        e.preventDefault();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'y') {
        redo();
        e.preventDefault();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'c') {
        if (selectedIds.length > 0) {
          const selected = elements.filter(el => selectedIds.includes(el.id));
          setCopiedElements(deepClone(selected));
        }
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'v') {
        if (copiedElements.length > 0) {
          const newElements = copiedElements.map(el => ({
            ...deepClone(el),
            id: uuidv4(),
            x: el.x + 20, // Offset paste
            y: el.y + 20,
          }));
          setElements(prev => {
            const next = [...prev, ...newElements];
            pushToHistory(next);
            return next;
          });
          setSelectedIds(newElements.map(e => e.id));
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          setElements(prev => {
            const next = prev.filter(el => !selectedIds.includes(el.id));
            pushToHistory(next);
            return next;
          });
          setSelectedIds([]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elements, selectedIds, copiedElements, undo, redo, pushToHistory]);

  // ==========================================
  // IMAGE PRELOADING
  // ==========================================
  useEffect(() => {
    let loadedCount = 0;
    const imageElements = elements.filter(el => el.type === 'image') as ImageElement[];
    if (imageElements.length === 0) return;

    imageElements.forEach(imgEl => {
      if (!imageCache.current.has(imgEl.imageSrc)) {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = imgEl.imageSrc;
        img.onload = () => {
          imageCache.current.set(imgEl.imageSrc, img);
          loadedCount++;
          if (loadedCount === imageElements.length) {
            setElements(prev => [...prev]); // trigger re-render
          }
        };
      }
    });
  }, [elements]);

  // ==========================================
  // RESPONSIVE CANVAS SCALING
  // ==========================================
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      // Calculate zoom to fit container while maintaining aspect ratio
      const scaleX = (width - 64) / CANVAS_WIDTH; // 64px padding
      const scaleY = (height - 64) / CANVAS_HEIGHT;
      const initialZoom = Math.min(scaleX, scaleY, 1);
      
      // Only set initial zoom once or if we need to enforce bounds
      setZoom(prev => prev === 1 ? initialZoom : prev);
    });
    
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Update Transformer selection
  useEffect(() => {
    if (stageRef.current && transformerRef.current) {
      const nodes = selectedIds
        .map(id => stageRef.current?.findOne(`#${id}`))
        .filter(node => node && (node as Konva.Node).visible()) as Konva.Node[];
      
      transformerRef.current.nodes(nodes);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedIds, elements]);

  // ==========================================
  // ACTIONS & HANDLERS
  // ==========================================
  const applyTemplate = (templateName: string) => {
    const template = DEFAULT_TEMPLATES[templateName];
    if (template) {
      const newElements = deepClone(template);
      setElements(newElements);
      setBackgroundColor(templateName === 'modern' ? '#111827' : '#ffffff');
      pushToHistory(newElements, templateName === 'modern' ? '#111827' : '#ffffff');
      setSelectedIds([]);
    }
  };

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>, recordHistory = true) => {
    setElements(prev => {
      const next = prev.map(el => (el.id === id ? { ...el, ...updates } as CanvasElement : el));
      if (recordHistory) pushToHistory(next);
      return next;
    });
  }, [pushToHistory]);

  const addText = (preset: 'heading' | 'subheading' | 'body') => {
    const configs = {
      heading: { size: 64, weight: 'bold' as const, content: 'Heading Text' },
      subheading: { size: 32, weight: 'normal' as const, content: 'Subheading Text' },
      body: { size: 18, weight: 'normal' as const, content: 'Add a little bit of body text' },
    };
    
    const conf = configs[preset];
    const newText: TextElement = {
      id: uuidv4(),
      type: 'text',
      x: CANVAS_WIDTH / 2 - 150,
      y: CANVAS_HEIGHT / 2 - conf.size / 2,
      content: conf.content,
      fontSize: conf.size,
      fontFamily: 'Arial, sans-serif',
      fontStyle: conf.weight,
      align: 'center',
      fill: '#1a1a1a',
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
      name: conf.content,
    };
    setElements(prev => {
      const next = [...prev, newText];
      pushToHistory(next);
      return next;
    });
    setSelectedIds([newText.id]);
  };

  const addShape = (shapeType: ShapeType) => {
    const newShape: ShapeElement = {
      id: uuidv4(),
      type: 'shape',
      shapeType,
      x: CANVAS_WIDTH / 2 - 50,
      y: CANVAS_HEIGHT / 2 - 50,
      width: 100,
      height: 100,
      fill: '#e5e7eb',
      stroke: '#9ca3af',
      strokeWidth: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      visible: true,
      locked: false,
      name: `New ${shapeType}`,
    };
    setElements(prev => {
      const next = [...prev, newShape];
      pushToHistory(next);
      return next;
    });
    setSelectedIds([newShape.id]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;
        const maxDim = 300;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width *= ratio;
          height *= ratio;
        }
        
        const newImage: ImageElement = {
          id: uuidv4(),
          type: 'image',
          x: CANVAS_WIDTH / 2 - width / 2,
          y: CANVAS_HEIGHT / 2 - height / 2,
          width,
          height,
          imageSrc: event.target?.result as string,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          visible: true,
          locked: false,
          name: file.name,
        };
        setElements(prev => {
          const next = [...prev, newImage];
          pushToHistory(next);
          return next;
        });
        setSelectedIds([newImage.id]);
      };
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    setElements(prev => {
      const next = prev.filter(el => !selectedIds.includes(el.id));
      pushToHistory(next);
      return next;
    });
    setSelectedIds([]);
  };

  const duplicateSelected = () => {
    if (selectedIds.length === 0) return;
    const selected = elements.filter(el => selectedIds.includes(el.id));
    const newElements = selected.map(el => ({
      ...deepClone(el),
      id: uuidv4(),
      x: el.x + 20,
      y: el.y + 20,
      name: `${el.name || el.type} (Copy)`
    }));
    
    setElements(prev => {
      const next = [...prev, ...newElements];
      pushToHistory(next);
      return next;
    });
    setSelectedIds(newElements.map(e => e.id));
  };

  const changeLayerOrder = (direction: 'front' | 'back' | 'forward' | 'backward') => {
    if (selectedIds.length !== 1) return; // Restrict to single item for simplicity
    const id = selectedIds[0];
    const index = elements.findIndex(el => el.id === id);
    if (index === -1) return;

    let newElements = [...elements];
    const [item] = newElements.splice(index, 1);

    if (direction === 'front') newElements.push(item);
    else if (direction === 'back') newElements.unshift(item);
    else if (direction === 'forward') newElements.splice(Math.min(newElements.length, index + 1), 0, item);
    else if (direction === 'backward') newElements.splice(Math.max(0, index - 1), 0, item);

    setElements(newElements);
    pushToHistory(newElements);
  };

  const handleExport = async (format: 'png' | 'jpeg') => {
    if (!stageRef.current) return;
    setSelectedIds([]); // Deselect before export to remove transformer boxes
    
    // Slight delay to ensure transformer disappears
    setTimeout(() => {
      const uri = stageRef.current!.toDataURL({ 
        pixelRatio: 3, // High quality export
        mimeType: `image/${format}`,
        quality: 1
      });
      const link = document.createElement('a');
      link.download = `certificate-design.${format}`;
      link.href = uri;
      link.click();
    }, 100);
  };

  // ==========================================
  // DRAG & SNAPPING LOGIC
  // ==========================================
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    if (node.getClassName() === 'Transformer') return; // Don't snap transformer itself
    
    const center = getCenterCoordinates(node);
    const newGuidelines: Guideline[] = [];
    
    // Snap to vertical center of canvas
    if (Math.abs(center.x - CANVAS_WIDTH / 2) < SNAP_THRESHOLD) {
      node.x(CANVAS_WIDTH / 2 - center.width / 2);
      newGuidelines.push({
        orientation: 'vertical',
        points: [CANVAS_WIDTH / 2, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT]
      });
    }
    
    // Snap to horizontal center of canvas
    if (Math.abs(center.y - CANVAS_HEIGHT / 2) < SNAP_THRESHOLD) {
      node.y(CANVAS_HEIGHT / 2 - center.height / 2);
      newGuidelines.push({
        orientation: 'horizontal',
        points: [0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, CANVAS_HEIGHT / 2]
      });
    }
    
    setGuidelines(newGuidelines);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setGuidelines([]); // Clear guides
    const node = e.target;
    updateElement(node.id(), { x: node.x(), y: node.y() });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const el = elements.find(item => item.id === node.id());
    if (!el) return;

    const updates: Partial<CanvasElement> = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: 1, // Reset scale and apply to width/height to avoid weird distortions
      scaleY: 1,
    };

    if (el.type === 'shape' || el.type === 'image') {
      // For shapes/images, apply scale to width/height
      (updates as any).width = Math.max(5, (el as any).width * node.scaleX());
      (updates as any).height = Math.max(5, (el as any).height * node.scaleY());
    } else if (el.type === 'text') {
      // For text, adjust font size or width depending on how you want scaling to work.
      // Here we just apply scale to width for wrapping, or scale fontSize.
      (updates as any).width = Math.max(10, (node as any).width() * node.scaleX());
    }
    
    // Reset Konva node scale so it doesn't double-apply
    node.scaleX(1);
    node.scaleY(1);
    
    updateElement(node.id(), updates);
  };

  // ==========================================
  // RENDER CANVAS ELEMENT
  // ==========================================
  const renderCanvasElement = (el: CanvasElement) => {
    if (!el.visible) return null;

    const commonProps = {
      id: el.id,
      x: el.x,
      y: el.y,
      rotation: el.rotation,
      scaleX: el.scaleX,
      scaleY: el.scaleY,
      opacity: el.opacity,
      draggable: !el.locked,
      onClick: (e: any) => {
        e.cancelBubble = true;
        if (!el.locked) setSelectedIds([el.id]);
      },
      onTap: (e: any) => {
        e.cancelBubble = true;
        if (!el.locked) setSelectedIds([el.id]);
      },
      onDragMove: handleDragMove,
      onDragEnd: handleDragEnd,
      onTransformEnd: handleTransformEnd,
    };

    if (el.type === 'text') {
      // Handle text alignment requiring explicit width if centered/right
      const widthProp = el.align !== 'left' ? { width: el.align === 'center' ? CANVAS_WIDTH : undefined } : {};
      // If we force width to canvas width for centering, we need to adjust X to 0. 
      // But standard dragging changes X. A robust implementation would use a bounding box. 
      // We will let Konva handle basic align within its box.
      
      return (
        <Text
          key={el.id}
          {...commonProps}
          text={el.content}
          fontSize={el.fontSize}
          fontFamily={el.fontFamily}
          fontStyle={el.fontStyle}
          align={el.align}
          fill={el.fill}
          width={CANVAS_WIDTH} // Simplified: let text box span canvas, offset handled natively or by align
          offsetX={CANVAS_WIDTH / 2} // Center the origin to make scaling/rotation feel natural
          x={el.x + CANVAS_WIDTH / 2}
        />
      );
    }

    if (el.type === 'image') {
      const loadedImage = imageCache.current.get(el.imageSrc);
      if (!loadedImage) return null;
      return (
        <KonvaImage
          key={el.id}
          {...commonProps}
          width={el.width}
          height={el.height}
          image={loadedImage}
        />
      );
    }

    if (el.type === 'shape') {
      if (el.shapeType === 'rect') {
        return (
          <Rect
            key={el.id}
            {...commonProps}
            width={el.width}
            height={el.height}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
          />
        );
      } else if (el.shapeType === 'circle') {
        return (
          <KonvaCircle
            key={el.id}
            {...commonProps}
            width={el.width}
            height={el.height}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
          />
        );
      } else if (el.shapeType === 'triangle') {
        return (
          <Rect // Konva doesn't have a native basic triangle, using regular polygon or custom path. Using Polygon for triangle.
            key={el.id}
            {...commonProps}
            sceneFunc={(context, shape) => {
              context.beginPath();
              context.moveTo(el.width / 2, 0);
              context.lineTo(el.width, el.height);
              context.lineTo(0, el.height);
              context.closePath();
              context.fillStrokeShape(shape);
            }}
            width={el.width}
            height={el.height}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
          />
        );
      } else if (el.shapeType === 'star') {
        return (
          <Star
            key={el.id}
            {...commonProps}
            numPoints={5}
            innerRadius={Math.min(el.width, el.height) / 4}
            outerRadius={Math.min(el.width, el.height) / 2}
            fill={el.fill}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            offsetX={-el.width / 2}
            offsetY={-el.height / 2}
          />
        );
      }
    }
    return null;
  };

  // ==========================================
  // RENDER UI: SIDEBAR & PANELS
  // ==========================================
  const renderSidebarTab = (id: typeof activeTab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
        activeTab === id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );

  const selectedElement = elements.find(el => selectedIds[0] === el.id);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* --- TOP NAVBAR --- */}
      <header className="h-14 bg-white border-b px-4 flex items-center justify-between shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
            <LayoutTemplate size={24} />
            <span>CertiCreate</span>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          {/* File Operations */}
          <div className="flex items-center gap-1">
            <button onClick={undo} disabled={historyIndex === 0} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)">
              <Undo2 size={18} />
            </button>
            <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-30 transition-colors" title="Redo (Ctrl+Y)">
              <Redo2 size={18} />
            </button>
          </div>
        </div>
        
        {/* Export / Download */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-md p-1">
            <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1 hover:bg-white rounded shadow-sm text-gray-600">
              <ZoomIn size={16} />
            </button>
          </div>
          <button onClick={() => handleExport('png')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      {/* --- CONTEXTUAL TOOLBAR --- */}
      <div className="h-12 bg-white border-b flex items-center px-4 gap-4 shrink-0 overflow-x-auto no-scrollbar z-20">
        {selectedElement ? (
          <>
            {/* Text Specific Tools */}
            {selectedElement.type === 'text' && (
              <div className="flex items-center gap-3 border-r pr-4 border-gray-200 shrink-0">
                <select 
                  value={(selectedElement as TextElement).fontFamily}
                  onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                  className="h-8 border border-gray-300 rounded px-2 text-sm w-40 focus:ring-1 focus:ring-indigo-500"
                >
                  {FONTS.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
                </select>
                
                <div className="flex items-center border border-gray-300 rounded overflow-hidden h-8">
                  <input 
                    type="number" 
                    value={(selectedElement as TextElement).fontSize}
                    onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 12 })}
                    className="w-14 text-center text-sm border-none focus:ring-0"
                  />
                </div>

                <input 
                  type="color" 
                  value={(selectedElement as TextElement).fill}
                  onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0 overflow-hidden"
                  title="Text Color"
                />

                <div className="flex items-center bg-gray-100 rounded p-0.5 gap-0.5">
                  <button 
                    onClick={() => {
                      const isBold = (selectedElement as TextElement).fontStyle.includes('bold');
                      const base = (selectedElement as TextElement).fontStyle.replace('bold', '').trim();
                      updateElement(selectedElement.id, { fontStyle: isBold ? (base || 'normal') as any : `${base} bold` as any });
                    }}
                    className={`p-1.5 rounded ${((selectedElement as TextElement).fontStyle || '').includes('bold') ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Bold size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      const isItalic = (selectedElement as TextElement).fontStyle.includes('italic');
                      const base = (selectedElement as TextElement).fontStyle.replace('italic', '').trim();
                      updateElement(selectedElement.id, { fontStyle: isItalic ? (base || 'normal') as any : `${base} italic` as any });
                    }}
                    className={`p-1.5 rounded ${((selectedElement as TextElement).fontStyle || '').includes('italic') ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Italic size={16} />
                  </button>
                </div>

                <div className="flex items-center bg-gray-100 rounded p-0.5 gap-0.5">
                  {(['left', 'center', 'right'] as TextAlign[]).map(align => (
                    <button 
                      key={align}
                      onClick={() => updateElement(selectedElement.id, { align })}
                      className={`p-1.5 rounded ${(selectedElement as TextElement).align === align ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                      {align === 'left' && <AlignLeft size={16} />}
                      {align === 'center' && <AlignCenter size={16} />}
                      {align === 'right' && <AlignRight size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shape Specific Tools */}
            {selectedElement.type === 'shape' && (
              <div className="flex items-center gap-3 border-r pr-4 border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Fill</span>
                  <input 
                    type="color" 
                    value={(selectedElement as ShapeElement).fill}
                    onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Border</span>
                  <input 
                    type="color" 
                    value={(selectedElement as ShapeElement).stroke || '#000000'}
                    onChange={(e) => updateElement(selectedElement.id, { stroke: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Weight</span>
                  <input 
                    type="range" min="0" max="50" 
                    value={(selectedElement as ShapeElement).strokeWidth || 0}
                    onChange={(e) => updateElement(selectedElement.id, { strokeWidth: parseInt(e.target.value) })}
                    className="w-24 accent-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* Global Element Tools */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 mr-2">
                <span className="text-xs text-gray-500 font-medium">Opacity</span>
                <input 
                  type="range" min="0" max="1" step="0.05"
                  value={selectedElement.opacity}
                  onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) }, false)}
                  onMouseUp={(e) => pushToHistory(elements)} // Commit history on release
                  className="w-20 accent-indigo-600"
                />
              </div>

              <div className="flex bg-gray-100 rounded p-0.5">
                <button onClick={() => changeLayerOrder('back')} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded" title="Send to Back"><ArrowDownToLine size={16} /></button>
                <button onClick={() => changeLayerOrder('front')} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded" title="Bring to Front"><ArrowUpToLine size={16} /></button>
              </div>

              <button onClick={duplicateSelected} className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded" title="Duplicate"><Copy size={16} /></button>
              <button onClick={deleteSelected} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={16} /></button>
            </div>
          </>
        ) : (
          <span className="text-sm text-gray-400 italic flex items-center gap-2">
            <MousePointer2 size={16} /> Select an element to edit properties
          </span>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* --- LEFT SIDEBAR (RAIL) --- */}
        <nav className="w-16 bg-gray-950 flex flex-col items-center py-4 gap-2 shrink-0 z-20">
          {renderSidebarTab('templates', <LayoutTemplate size={22} strokeWidth={1.5} />, 'Design')}
          {renderSidebarTab('text', <Type size={22} strokeWidth={1.5} />, 'Text')}
          {renderSidebarTab('elements', <Shapes size={22} strokeWidth={1.5} />, 'Elements')}
          {renderSidebarTab('uploads', <ImageIcon size={22} strokeWidth={1.5} />, 'Uploads')}
          {renderSidebarTab('background', <Palette size={22} strokeWidth={1.5} />, 'Bkground')}
          {renderSidebarTab('layers', <Layers size={22} strokeWidth={1.5} />, 'Layers')}
        </nav>

        {/* --- LEFT PANEL (CONTENT) --- */}
        <aside className="w-80 bg-white border-r shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] flex flex-col shrink-0 z-10">
          <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
            
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Templates</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => applyTemplate('classic')} className="aspect-[4/3] bg-gray-100 border border-gray-200 hover:border-indigo-500 rounded-lg flex items-center justify-center relative overflow-hidden group transition-all">
                    <div className="w-[80%] h-[70%] border-4 border-yellow-600 p-2 flex flex-col items-center justify-center">
                       <div className="w-full h-2 bg-gray-800 mb-1"></div>
                       <div className="w-1/2 h-1 bg-gray-400 mb-2"></div>
                       <div className="w-3/4 h-3 bg-yellow-600"></div>
                    </div>
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="bg-white text-indigo-600 text-xs px-2 py-1 rounded font-medium shadow">Apply</span></div>
                  </button>
                  <button onClick={() => applyTemplate('modern')} className="aspect-[4/3] bg-gray-900 border border-gray-200 hover:border-indigo-500 rounded-lg flex items-center justify-center relative overflow-hidden group transition-all">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-purple-500 rounded-full opacity-50"></div>
                    <div className="z-10 flex flex-col items-center">
                      <div className="w-12 h-2 bg-white mb-1"></div>
                      <div className="w-16 h-4 bg-white/80"></div>
                    </div>
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="bg-white text-indigo-600 text-xs px-2 py-1 rounded font-medium shadow">Apply</span></div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Add Text</h3>
                <button onClick={() => addText('heading')} className="w-full py-4 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-colors">
                  <span className="block text-2xl font-bold text-gray-900">Add a heading</span>
                </button>
                <button onClick={() => addText('subheading')} className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-colors">
                  <span className="block text-lg font-medium text-gray-800">Add a subheading</span>
                </button>
                <button onClick={() => addText('body')} className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-colors">
                  <span className="block text-sm text-gray-600">Add a little bit of body text</span>
                </button>
              </div>
            )}

            {activeTab === 'elements' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Shapes</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => addShape('rect')} className="aspect-square bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center transition-colors">
                    <Square size={32} className="text-gray-700" />
                  </button>
                  <button onClick={() => addShape('circle')} className="aspect-square bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center transition-colors">
                    <Circle size={32} className="text-gray-700" />
                  </button>
                  <button onClick={() => addShape('triangle')} className="aspect-square bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center transition-colors">
                    <Triangle size={32} className="text-gray-700" />
                  </button>
                  <button onClick={() => addShape('star')} className="aspect-square bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center transition-colors">
                    <StarIcon size={32} className="text-gray-700" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'uploads' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Upload Media</h3>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 rounded-xl flex flex-col items-center justify-center text-indigo-600 transition-colors cursor-pointer"
                >
                  <ArrowUpToLine size={28} className="mb-2" />
                  <span className="font-medium">Upload Image</span>
                  <span className="text-xs text-indigo-400 mt-1">PNG, JPG up to 5MB</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>
            )}

            {activeTab === 'background' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Background Color</h3>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={e => {
                    setBackgroundColor(e.target.value);
                    pushToHistory(elements, e.target.value);
                  }}
                  className="w-full h-14 rounded-lg cursor-pointer border-2 border-gray-200 p-1"
                />
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#111827', '#1e3a8a', '#8b5cf6', '#c5a059', '#10b981', '#ef4444'].map(color => (
                    <button 
                      key={color} 
                      onClick={() => { setBackgroundColor(color); pushToHistory(elements, color); }}
                      className="aspect-square rounded-md border border-gray-200 shadow-sm transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'layers' && (
              <div className="space-y-4 flex flex-col h-full">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2 shrink-0">Layer Hierarchy</h3>
                <p className="text-xs text-gray-500 mb-2">Drag handles are visual only in this layout. Use order buttons in toolbar to adjust z-index.</p>
                <div className="space-y-1 overflow-y-auto flex-1 no-scrollbar pb-20">
                  {[...elements].reverse().map(el => (
                    <div
                      key={el.id}
                      onClick={() => setSelectedIds([el.id])}
                      className={`flex items-center justify-between p-3 border rounded-lg text-sm cursor-pointer transition-colors ${
                        selectedIds.includes(el.id) ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <GripVertical size={16} className="text-gray-300" />
                        {el.type === 'text' && <Type size={14} className="text-gray-400" />}
                        {el.type === 'shape' && <Square size={14} className="text-gray-400" />}
                        {el.type === 'image' && <ImageIcon size={14} className="text-gray-400" />}
                        <span className="truncate font-medium text-gray-700">
                          {el.name || (el.type === 'text' ? (el as TextElement).content : el.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-60 hover:opacity-100">
                        <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { visible: !el.visible }); }} className="p-1 hover:bg-gray-200 rounded">
                          {el.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }} className="p-1 hover:bg-gray-200 rounded">
                          {el.locked ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  {elements.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm italic">Canvas is empty</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* --- MAIN WORKSPACE (CANVAS) --- */}
        <main 
          className="flex-1 flex items-center justify-center bg-[#E5E7EB] overflow-auto relative p-8"
          onClick={() => setSelectedIds([])} // Deselect on clicking background
        >
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center relative"
          >
            {/* The actual paper shadow and wrapper */}
            <div 
              className="bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] transition-transform duration-200 origin-center"
              style={{ 
                width: CANVAS_WIDTH, 
                height: CANVAS_HEIGHT,
                transform: `scale(${zoom})`
              }}
            >
              <Stage
                ref={stageRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={e => {
                  if (e.target === e.target.getStage()) setSelectedIds([]);
                }}
              >
                {/* Background Layer */}
                <Layer>
                  <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={backgroundColor} />
                </Layer>
                
                {/* Content Layer */}
                <Layer>
                  {elements.map(renderCanvasElement)}
                  
                  {/* Guidelines for snapping */}
                  {guidelines.map((line, i) => (
                    <Line
                      key={`guide-${i}`}
                      points={line.points}
                      stroke="#f50057"
                      strokeWidth={1}
                      dash={[4, 4]}
                    />
                  ))}

                  {/* Single Selection Transformer */}
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) return oldBox;
                      return newBox;
                    }}
                    borderStroke="#6366f1"
                    borderStrokeWidth={2}
                    anchorFill="#ffffff"
                    anchorStroke="#6366f1"
                    anchorSize={10}
                    anchorCornerRadius={5}
                    keepRatio={false}
                    padding={2}
                  />
                </Layer>
              </Stage>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Custom simple Icons replacement for Shapes
function Shapes(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 22H2.99a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2H8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2Z"></path>
      <circle cx="17" cy="7" r="5"></circle>
      <path d="m14 22 3-8 3 8"></path>
    </svg>
  )
}